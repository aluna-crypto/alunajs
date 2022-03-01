import { IAlunaMarketSchema } from '../schemas/IAlunaMarketSchema'



export interface IAlunaMarketModule {

  list (): Promise<IAlunaMarketSchema[]>
  listRaw (): Promise<any[]>

  get? (params: { symbolPair: string }): Promise<IAlunaMarketSchema>
  getRaw? (params: { symbolPair: string }): Promise<any>

  parse (params: { rawMarket: any }): IAlunaMarketSchema
  parseMany (parms: { rawMarkets: any[] }): IAlunaMarketSchema[]

}
