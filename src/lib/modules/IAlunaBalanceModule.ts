import { IAlunaModule } from '../core/IAlunaModule'
import { AlunaAccountEnum } from '../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../enums/AlunaOrderSideEnum'
import { IAlunaBalanceSchema } from '../schemas/IAlunaBalanceSchema'



export interface IAlunaBalanceGetTradableBalanceParams {
  symbolPair: string
  account?: AlunaAccountEnum
  side?: AlunaOrderSideEnum
  rate?: number
}



export interface IAlunaBalanceModule extends IAlunaModule {

  list (): Promise<IAlunaBalanceSchema[]>
  listRaw (): Promise<any[]>

  parse (params: { rawBalance: any }): IAlunaBalanceSchema
  parseMany (params: { rawBalances: any[] }): IAlunaBalanceSchema[]

  getTradableBalance? (
    params: IAlunaBalanceGetTradableBalanceParams
  ): Promise<number>

}
