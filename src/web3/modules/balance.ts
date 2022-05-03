import { Web3 } from '../Web3'
import {
  getRawTotalBalance,
  IWeb3GetRawTotalBalanceParams,
  IWeb3GetRawTotalBalanceReturns,
} from './balance/getRawTotalBalance'
import {
  IWeb3BalanceListParams,
  IWeb3BalanceListReturns,
  list,
} from './balance/list'
import {
  IWeb3BalanceParseManyParams,
  IWeb3BalanceParseManyReturns,
  parseMany,
} from './balance/parseMany'



export interface IWeb3BalanceModule {

  /* eslint-disable max-len */

  list(params?: IWeb3BalanceListParams): Promise<IWeb3BalanceListReturns>
  parseMany(params: IWeb3BalanceParseManyParams): IWeb3BalanceParseManyReturns
  getRawTotalBalance(params?: IWeb3GetRawTotalBalanceParams): Promise<IWeb3GetRawTotalBalanceReturns>

  /* eslint-enable max-len */

}



export function balance(web3: Web3): IWeb3BalanceModule {

  return {
    list: list(web3),
    parseMany: parseMany(web3),
    getRawTotalBalance: getRawTotalBalance(web3),
  }

}
