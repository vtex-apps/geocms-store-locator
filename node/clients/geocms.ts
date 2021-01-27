import crypto from 'crypto'

import type { InstanceOptions, IOContext } from '@vtex/api'
import { ExternalClient } from '@vtex/api'

import type { GeoCMSResponse } from '../typings/stores'

interface GetStoresArgs {
  appLicense: string
  appProject: string
  appKey: string
  latitude?: number
  longitude?: number
  radius?: number
  offset?: number
  quantity: number
}

interface GetStoreArgs {
  appLicense: string
  appProject: string
  appKey: string
  id: string
}

export default class GeoCMS extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super('http://www.geocms.it/server/api', context, options)
  }

  private getToken(appKey: string, endpoint: string) {
    return crypto
      .createHmac('sha1', appKey)
      .update(endpoint)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  public async getStores({
    appLicense,
    appProject,
    appKey,
    latitude,
    longitude,
    offset,
    quantity,
    radius,
  }: GetStoresArgs): Promise<GeoCMSResponse> {
    const geoSearch =
      latitude && longitude
        ? `&lat=${latitude}&lng=${longitude}&radius=${radius}`
        : ''

    const endpoint = `/read/object/text?project=${appProject}&frontend=rest&key=${appLicense}&encoding=utf-8&offset=${
      offset ?? 0
    }&hits=${quantity}${geoSearch}`

    const signedEndpoint = `${endpoint}&tk=${this.getToken(appKey, endpoint)}`

    return this.http.get(signedEndpoint, {
      metric: 'geocms-get-stores',
    })
  }

  public async getStore({
    appLicense,
    appProject,
    appKey,
    id,
  }: GetStoreArgs): Promise<GeoCMSResponse> {
    const endpoint = `/read/object/text?project=${appProject}&frontend=rest&key=${appLicense}&encoding=utf-8&query=[page_id]=[${id}]`
    const signedEndpoint = `${endpoint}&tk=${this.getToken(appKey, endpoint)}`

    return this.http.get(signedEndpoint, {
      metric: 'geocms-get-store',
    })
  }
}
