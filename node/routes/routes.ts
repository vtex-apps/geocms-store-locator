import { method } from '@vtex/api'
import { queries } from '../resolvers'

export const routes = {
  getSitemap: [
    method({
      GET: async (ctx: Context) => {
        try {
          const response = await queries.allStores(null, null, ctx)

          ctx.set('Content-Type', 'text/xml')

          const lastMod = new Date().toISOString()
          const storesMap = `
                <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
                  ${response.results
                    .map(store => {
                      return `<url>
                    <loc>${store.url}</loc>
                    <lastmod>${lastMod}</lastmod>
                    <changefreq>daily</changefreq>
                    <priority>0.8</priority>
                 </url>`
                    })
                    .join('')}
                </urlset>`

          ctx.body = storesMap
          ctx.status = 200
        } catch (e) {
          ctx.body = e
          ctx.status = 500
        }
      },
    }),
  ],
}
