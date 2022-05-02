import { Web3 } from '../Web3'
import {
  IWeb3BalanceListParams,
  IWeb3BalanceListReturns,
  list,
} from './balance/list'



export interface IWeb3BalanceModule {

  /* eslint-disable max-len */

  list(params?: IWeb3BalanceListParams): Promise<IWeb3BalanceListReturns<any[]>>

  /* eslint-enable max-len */

}



export function balance(module: Web3): IWeb3BalanceModule {

  return {
    list: list(module),
  }

}
