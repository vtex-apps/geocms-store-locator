import { siteMapStoreData } from '../typings/stores'
import { parseStoreParams } from '../utils/parseStoreParams'

const API_MAX_QUANTITY = 50

export const allStores = async (
  _: any,
  _param: any,
  ctx: Context
): Promise<{ results: siteMapStoreData[] }> => {
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

  const locations: siteMapStoreData[] = []

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
      const { Store_name } = obj.data.MKTG[0]
      const { cod_mag } = obj.data.main

      stores.push({
        id: cod_mag,
        url: `https://${ctx.vtex.host}/${customPath}/${parseStoreParams(
          Store_name
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
