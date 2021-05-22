import {
  IAlunaBalanceSchema,
} from '../schemas/IAlunaBalanceSchema'



export interface IAlunaBalance {

  list (): Promise<IAlunaBalanceSchema[]>
  parse (params: { rawBalance: any }): IAlunaBalanceSchema
  parseMany (parms: { rawBalances: any[] }): IAlunaBalanceSchema[]

}
