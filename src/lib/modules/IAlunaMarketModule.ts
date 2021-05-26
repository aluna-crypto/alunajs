import { IAlunaModule } from '@lib/abstracts/IAlunaModule'

import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'



export interface IAlunaMarketModule extends IAlunaModule {

  list (): Promise<IAlunaMarketSchema[]>
  get? (params: { id: string | number }): Promise<IAlunaMarketSchema>
  parse (params: { rawMarket: any }): IAlunaMarketSchema
  parseMany (parms: { rawMarkets: any[] }): IAlunaMarketSchema[]

}
