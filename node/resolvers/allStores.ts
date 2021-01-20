import { SiteMapStoreData } from '../typings/stores'
import { parseStoreParams } from '../utils/parseStoreParams'

const API_MAX_QUANTITY = 50

export const allStores = async (
  _: any,
  _param: any,
  ctx: Context
): Promise<{ results: SiteMapStoreData[] }> => {
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

  const locations: SiteMapStoreData[] = []

  const quantity = API_MAX_QUANTITY
  let offset = 0
  let total = 0

  do {
    const response = await geoCMS.getStores({
      appLicense,
      appProject,
      appKey,
      offset,
      quantity,
    })

    const data = response.layers[0].objects.reduce((stores: any[], obj) => {
      if (!obj.data.MKTG) {
        return stores
      }
      const [{ Store_name: storeName }] = obj.data.MKTG
      const { cod_mag: codMag } = obj.data.main

      stores.push({
        id: codMag,
        url: `https://${ctx.vtex.host}/${customPath}/${parseStoreParams(
          storeName
        )}`,
      })

      return stores
    }, [])

    if (data) {
      locations.push(...data)
    }

    total = response.total
    offset = offset + API_MAX_QUANTITY
  } while (total > offset)

  return { results: locations }
}
