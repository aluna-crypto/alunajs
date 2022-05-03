import { Web3 } from '../Web3'
import {
  getTotalBalance,
  IWeb3GetTotalBalanceParams,
  IWeb3GetTotalBalanceReturns,
} from './balance/getTotalBalance'
import {
  IWeb3BalanceListParams,
  IWeb3BalanceListReturns,
  list,
} from './balance/list'



export interface IWeb3BalanceModule {

  /* eslint-disable max-len */

  list(params?: IWeb3BalanceListParams): Promise<IWeb3BalanceListReturns>
  getTotalBalance(params?: IWeb3GetTotalBalanceParams): Promise<IWeb3GetTotalBalanceReturns>

  /* eslint-enable max-len */

}



export function balance(web3: Web3): IWeb3BalanceModule {

  return {
    list: list(web3),
    getTotalBalance: getTotalBalance(web3),
  }

}
