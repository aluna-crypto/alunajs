import { Web3 } from '../Web3'
import {
  IWeb3TokenListRawParams,
  IWeb3TokenListRawReturns,
  listRaw,
} from './token/listRaw'



export interface IWeb3TokenModule {

  listRaw(params?: IWeb3TokenListRawParams): Promise<IWeb3TokenListRawReturns>

}



export function token(web3: Web3): IWeb3TokenModule {

  return {
    listRaw: listRaw(web3),
  }

}
