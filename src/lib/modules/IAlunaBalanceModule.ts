import {
  AlunaAccountEnum,
  AlunaSideEnum,
} from '../..'
import { IAlunaModule } from '../core/IAlunaModule'
import { IAlunaBalanceSchema } from '../schemas/IAlunaBalanceSchema'



export interface IFetchTradableBalanceParams {
  symbolPair: string
  account: AlunaAccountEnum
  side: AlunaSideEnum
  rate: number
}



export interface IAlunaBalanceModule extends IAlunaModule {

  list (): Promise<IAlunaBalanceSchema[]>
  listRaw (): Promise<any[]>

  parse (params: { rawBalance: any }): IAlunaBalanceSchema
  parseMany (params: { rawBalances: any[] }): IAlunaBalanceSchema[]

  fetchTradableBalance? (params: IFetchTradableBalanceParams): Promise<number>

}
