import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

const saveIndexMutation = `mutation SaveIndex($index: String!) {
    saveIndex(index: $index)
}`

export default class Sitemap extends AppGraphQLClient {
  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.store-sitemap@2.x', ctx, opts)
  }

  public async hasSitemap() {
    const ret = await this.http.get(
      `http://${this.context.workspace}--${this.context.account}.myvtex.com/sitemap.xml`
    )

    return ret.indexOf('store-locator') !== -1
  }

  public async saveIndex() {
    const { tenant } = this.context

    this.graphql.mutate(
      {
        mutate: saveIndexMutation,
        variables: { index: 'store-locator' },
      },
      {
        headers: {
          ...this.options?.headers,
          'Proxy-Authorization': this.context.authToken,
          VtexIdclientAutCookie: this.context.authToken,
          'x-vtex-tenant': tenant,
        },
        metric: 'storelocator-save-root-index',
      }
    )
  }
}
