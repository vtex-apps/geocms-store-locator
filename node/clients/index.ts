import { IOClients } from '@vtex/api'

import GeoCMS from './geocms'
import Sitemap from './sitemap'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get geoCMS() {
    return this.getOrSet('geoCMS', GeoCMS)
  }

  public get sitemap() {
    return this.getOrSet('sitemap', Sitemap)
  }
}
