import { AlunaAccountEnum } from '../../enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../enums/AlunaOrderSideEnum'
import { IAlunaBalanceSchema } from '../../schemas/IAlunaBalanceSchema'
import { IAlunaApiRequestSchema } from '../../schemas/IAlunaModuleSchema'



export interface IAlunaBalanceModule {

  /* eslint-disable max-len */

  listRaw (): Promise<IAlunaBalanceListRawReturns>
  list (): Promise<IAlunaBalanceListReturns>

  parseMany (params: IAlunaBalanceParseManyParams): IAlunaBalanceParseManyReturns
  parse (params: IAlunaBalanceParseParams): IAlunaBalanceParseReturns

  getTradableBalance? (params: IAlunaBalanceGetTradableBalanceParams): Promise<IAlunaBalanceGetTradableBalanceReturns>

  /* eslint-enable max-len */

}



/**
 * Parse
 */

export interface IAlunaBalanceParseParams {
  rawBalance: any
}

export interface IAlunaBalanceParseReturns extends IAlunaApiRequestSchema {
  balance: IAlunaBalanceSchema
}



export interface IAlunaBalanceParseManyParams {
  rawBalances: any[]
}

export interface IAlunaBalanceParseManyReturns extends IAlunaApiRequestSchema {
  balances: IAlunaBalanceSchema[]
}



/**
 * List
 */

export interface IAlunaBalanceListRawReturns<T = any> extends IAlunaApiRequestSchema {
  rawBalances: T[]
}

export interface IAlunaBalanceListReturns extends IAlunaApiRequestSchema {
  balances: IAlunaBalanceSchema[]
}



/**
 * Get Tradable Balance
 */

export interface IAlunaBalanceGetTradableBalanceParams {
  symbolPair: string
  account?: AlunaAccountEnum
  side?: AlunaOrderSideEnum
  rate?: number
}

export interface IAlunaBalanceGetTradableBalanceReturns extends IAlunaApiRequestSchema {
  tradableBalance: number
}
