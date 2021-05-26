import { IAlunaModule } from '@lib/abstracts/IAlunaModule'

import { IAlunaBalanceSchema } from '../schemas/IAlunaBalanceSchema'



export interface IAlunaBalanceModule extends IAlunaModule {

  list (): Promise<IAlunaBalanceSchema[]>
  parse (params: { rawBalance: any }): IAlunaBalanceSchema
  parseMany (params: { rawBalances: any[] }): IAlunaBalanceSchema[]

}
