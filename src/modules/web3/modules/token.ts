import { Web3 } from '../Web3'
import {
  IWeb3TokenListParams,
  IWeb3TokenListReturns,
  list,
} from './token/list'



export interface IWeb3TokenModule {

  /* eslint-disable max-len */

  list(params?: IWeb3TokenListParams): Promise<IWeb3TokenListReturns>

  /* eslint-enable max-len */

}



export function token(module: Web3): IWeb3TokenModule {

  return {
    list: list(module),
  }

}
