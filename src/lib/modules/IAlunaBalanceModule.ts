import { IAlunaBalanceSchema } from '../schemas/IAlunaBalanceSchema'



export interface IAlunaBalanceModule {

  list (): Promise<IAlunaBalanceSchema[]>
  parse (params: { rawBalance: any }): IAlunaBalanceSchema
  parseMany (params: { rawBalances: any[] }): IAlunaBalanceSchema[]

}
