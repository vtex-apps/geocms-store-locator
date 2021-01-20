import { GraphQLError } from '../graphql/GraphQLError'
import { formatBusinessHours } from '../utils/formatBusinessHours'
import { parseStoreParams } from '../utils/parseStoreParams'
import { queries } from '.'
import type {
  GeoCMSResponse,
  HolidayHours,
  StoreDetail,
  StoreGraphQL,
} from '../typings/stores'

const storeIdLookup: { [key: string]: string } = {}

const setstoreIdLookupTable = async (ctx: Context) => {
  try {
    const { results } = await queries.allStores(null, null, ctx)

    for (const store of results) {
      const parts = store.url.split('/')

      storeIdLookup[parts[parts.length - 1]] = store.id
    }
  } catch (err) {
    ctx.vtex.logger.error({
      message: 'Error creating store ID lookup table',
    })
  }
}

export const store = async (
  _: any,
  args: { id: string; amenities: string[] },
  ctx: Context
): Promise<StoreGraphQL> => {
  const { id, amenities } = args
  const {
    clients: { apps, geoCMS },
  } = ctx

  const appId = process.env.VTEX_APP_ID as string
  const {
    appLicense,
    appProject,
    appKey,
    customPath,
  } = await apps.getAppSettings(appId)

  if (!storeIdLookup[id]) {
    await setstoreIdLookupTable(ctx)
  }

  let response: GeoCMSResponse

  try {
    response = await geoCMS.getStore({
      appLicense,
      appProject,
      appKey,
      id: storeIdLookup[id],
    })
  } catch (error) {
    throw new TypeError(error.msg)
  }

  if (response.status.code !== 0) {
    const { message, code } = response.status

    throw new GraphQLError(message, code)
  }

  if (!response.layers[0].objects[0].data.MKTG) {
    return { results: null, structuredData: '' }
  }

  const [mktg] = response.layers[0].objects[0].data.MKTG
  const specialHours = response.layers[0].objects[0].data.SPECIAL_HOURS
  const img = response.layers[0].objects[0].data.IMG
  const { lng, lat } = response.layers[0].objects[0].geom

  const storeDetail: StoreDetail = {
    id: parseStoreParams(mktg.Store_name),
    name: mktg.Store_name,
    description: mktg.description,
    address: {
      street: mktg.address,
      city: mktg.city,
      region: mktg.suburb,
      state: mktg.state,
      country: mktg.country,
      postalCode: mktg.zipcode,
    },
    googleMapLink: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
    businessHours: formatBusinessHours(mktg),
    holidayHours: specialHours.reduce((hours: HolidayHours[], specialHour) => {
      const current = {
        date: specialHour.Date,
        openIntervals: [],
        isClosed: false,
      } as HolidayHours

      if (!specialHour.open_morning && !specialHour.open_afternoon) {
        if (specialHour.open_morning && specialHour.close_morning) {
          current.openIntervals.push({
            open: specialHour.open_morning,
            close: specialHour.close_morning,
          })
        }

        if (specialHour.open_afternoon && specialHour.close_afternoon) {
          current.openIntervals.push({
            open: specialHour.open_afternoon,
            close: specialHour.close_afternoon,
          })
        }
      } else {
        current.isClosed = true
      }

      hours.push(current)

      return hours
    }, []),
    manager: mktg.Area_manager,
    contacts: {
      mainPhone: mktg.Store_phone,
    },
    amenities: amenities.map((amenity) => {
      const value = (mktg[amenity] as string).toLowerCase()
      const hasAmenity = value !== '' && value !== 'no' && value !== 'false'

      return {
        label: amenity,
        value: hasAmenity,
      }
    }),
    location: {
      latitude: lat,
      longitude: lng,
    },
    images: img
      ? img.map(({ Image }) => {
          return {
            url: Image,
          }
        })
      : [],
  }

  const structuredData = () => {
    const { longitude, latitude } = storeDetail.location
    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    return {
      '@context': 'https://schema.org',
      '@type': 'Store',
      '@id': `https://${ctx.vtex.host}/${customPath}/${storeDetail.id}`,
      name: storeDetail.name,
      image: storeDetail.images.map((i) => i.url),
      telephone: storeDetail.contacts.mainPhone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: storeDetail.address.street,
        addressLocality: storeDetail.address.city,
        addressRegion: storeDetail.address.state,
        postalCode: storeDetail.address.postalCode,
        addressCountry: storeDetail.address.country,
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude,
        longitude,
      },
      url: `https://${ctx.vtex.host}/${customPath}/${storeDetail.id}`,
      openingHoursSpecification: storeDetail.businessHours.reduce(
        (schema: Array<Record<string, string | string[]>>, hours) => {
          hours.openIntervals.forEach((i) => {
            const [opensHour, opensMinute] = i.open.split(':')
            const [closesHour, closesMinute] = i.close.split(':')

            schema.push({
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: [weekDays[hours.day]],
              opens: `${opensHour}:${opensMinute}`,
              closes: `${closesHour}:${closesMinute}`,
            })
          })

          return schema
        },
        []
      ),
    }
  }

  return {
    results: storeDetail,
    structuredData: JSON.stringify(structuredData()),
  }
}
