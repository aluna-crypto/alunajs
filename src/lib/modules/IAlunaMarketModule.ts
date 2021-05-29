import { IAlunaModule } from '@lib/abstracts/IAlunaModule'

import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'



export interface IAlunaMarketModule extends IAlunaModule {

  list (): Promise<IAlunaMarketSchema[]>
  listRaw (): Promise<any[]>

  get? (params: { id: string | number }): Promise<IAlunaMarketSchema>
  getRaw? (params: { id: string | number }): Promise<any>

  parse (params: { rawMarket: any }): IAlunaMarketSchema
  parseMany (parms: { rawMarkets: any[] }): IAlunaMarketSchema[]

}
