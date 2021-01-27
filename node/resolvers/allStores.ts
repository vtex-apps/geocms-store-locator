/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SiteMapStoreData } from '../typings/stores'

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
    // eslint-disable-next-line no-await-in-loop
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

      const [{ page_id: pageId }] = obj.data.SEO

      stores.push({
        url: `https://${ctx.vtex.host}/${customPath}/${pageId}`,
      })

      return stores
    }, [])

    if (data) {
      locations.push(...data)
    }

    total = response.total
    offset += API_MAX_QUANTITY
  } while (total > offset)

  return { results: locations }
}
