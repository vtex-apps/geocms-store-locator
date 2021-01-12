import { GraphQLError } from '../graphql/GraphQLError'
import { formatBusinessHours } from '../utils/formatBusinessHours'
import { GeoCMSResponse, Store, StoresGraphQL } from '../typings/stores'
import { LogLevel } from '@vtex/api'
import { parseStoreParams } from '../utils/parseStoreParams'

interface storesArgs {
  latitude?: number
  longitude?: number
  offset: number
}

const DEFAULT_STORES_QUANTITY = 30
const DEFAULT_SEARCH_RADIUS = 25000

export const stores = async (
  _: any,
  args: storesArgs,
  ctx: Context
): Promise<StoresGraphQL> => {
  const {
    clients: { apps, geoCMS, sitemap },
    vtex: { logger },
  } = ctx

  try {
    const hasSitemap = await sitemap.hasSitemap()

    if (hasSitemap === false) {
      sitemap.saveIndex()
    }
  } catch (err) {
    logger.log(err, LogLevel.Error)
  }

  const appId = process.env.VTEX_APP_ID as string
  const { appLicense, appProject, appKey } = await apps.getAppSettings(appId)
  const quantity = DEFAULT_STORES_QUANTITY
  const radius = DEFAULT_SEARCH_RADIUS
  const { latitude, longitude } = args

  let response: GeoCMSResponse

  try {
    response = await geoCMS.getStores({
      appLicense,
      appProject,
      appKey,
      quantity,
      radius,
      latitude,
      longitude,
    })
  } catch (error) {
    throw new TypeError(error.response.data)
  }

  if (response.status.code !== 0) {
    const { message, code } = response.status

    throw new GraphQLError(message, code)
  }

  const stores = response.layers[0].objects.reduce(
    (stores: Store[], { data, geom }) => {
      if (!data.MKTG) {
        return stores
      }

      const mktg = data.MKTG[0]
      const { lng, lat } = geom

      stores.push({
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
        contacts: {
          mainPhone: mktg.Store_phone,
        },
        location: {
          latitude: lat,
          longitude: lng,
        },
      })
      return stores
    },
    []
  )
  return { results: stores }
}
