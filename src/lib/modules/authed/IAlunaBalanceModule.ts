import { AlunaAccountEnum } from '../../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../enums/AlunaOrderSideEnum'
import { IAlunaBalanceSchema } from '../../schemas/IAlunaBalanceSchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaBalanceModule {


  listRaw (params?: IAlunaBalanceListParams): Promise<IAlunaBalanceListRawReturns>
  list (params?: IAlunaBalanceListParams): Promise<IAlunaBalanceListReturns>

  parseMany (params: IAlunaBalanceParseManyParams): IAlunaBalanceParseManyReturns
  parse (params: IAlunaBalanceParseParams): IAlunaBalanceParseReturns

  getTradableBalance? (params: IAlunaBalanceGetTradableBalanceParams): Promise<IAlunaBalanceGetTradableBalanceReturns>

}



/**
 * Parse
 */

export interface IAlunaBalanceParseParams <T = any> {
  rawBalance: T
}

export interface IAlunaBalanceParseReturns {
  balance: IAlunaBalanceSchema
}



export interface IAlunaBalanceParseManyParams <T = any> {
  rawBalances: T
}

export interface IAlunaBalanceParseManyReturns {
  balances: IAlunaBalanceSchema[]
}



/**
 * List
 */

export interface IAlunaBalanceListParams extends IAlunaModuleParams {}

export interface IAlunaBalanceListRawReturns <T = any> extends IAlunaModuleReturns {
  rawBalances: T
}

export interface IAlunaBalanceListReturns extends IAlunaBalanceParseManyReturns, IAlunaModuleReturns {}



/**
 * Get Tradable Balance
 */

export interface IAlunaBalanceGetTradableBalanceParams extends IAlunaModuleParams {
  symbolPair: string
  account?: AlunaAccountEnum
  side?: AlunaOrderSideEnum
  rate?: number
}

export interface IAlunaBalanceGetTradableBalanceReturns extends IAlunaModuleReturns {
  tradableBalance: number
}
