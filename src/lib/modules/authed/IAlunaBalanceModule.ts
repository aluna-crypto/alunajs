import { AlunaAccountEnum } from '../../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../enums/AlunaOrderSideEnum'
import { IAlunaBalanceSchema } from '../../schemas/IAlunaBalanceSchema'
import {
  IAlunaModuleParams,
  IAlunaModuleReturns,
} from '../../schemas/IAlunaModuleSchema'



export interface IAlunaBalanceModule {

  /* eslint-disable max-len */

  listRaw (params?: IAlunaBalanceListParams): Promise<IAlunaBalanceListRawReturns>
  list (params?: IAlunaBalanceListParams): Promise<IAlunaBalanceListReturns>

  parseMany (params: IAlunaBalanceParseManyParams): Promise<IAlunaBalanceParseManyReturns>
  parse (params: IAlunaBalanceParseParams): Promise<IAlunaBalanceParseReturns>

  getTradableBalance? (params: IAlunaBalanceGetTradableBalanceParams): Promise<IAlunaBalanceGetTradableBalanceReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaBalanceParseParams <T = any> extends IAlunaModuleParams {
  rawBalance: T
}

export interface IAlunaBalanceParseReturns extends IAlunaModuleReturns {
  balance: IAlunaBalanceSchema
}



export interface IAlunaBalanceParseManyParams <T = any> extends IAlunaModuleParams {
  rawBalances: T[]
}

export interface IAlunaBalanceParseManyReturns extends IAlunaModuleReturns {
  balances: IAlunaBalanceSchema[]
}



/**
 * List
 */

export interface IAlunaBalanceListParams extends IAlunaModuleParams {}

export interface IAlunaBalanceListRawReturns <T = any> extends IAlunaModuleReturns {
  rawBalances: T[]
}

export interface IAlunaBalanceListReturns extends IAlunaBalanceParseManyReturns {}



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
