import debug from 'debug'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../../lib/core/IAlunaHttp'
import { IWeb3BalanceSchema } from '../../schemas/IWeb3BalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@aluna.js:web3/balance/listRaw')



export interface IWeb3BalanceListParams {
  http?: IAlunaHttp
  address?: string
}

export interface IWeb3BalanceListReturns<T> {
  balances: T
  requestCount: IAlunaHttpRequestCount
}



export const list = (module: Web3) => async (
  params: IWeb3BalanceListParams = {},
): Promise<IWeb3BalanceListReturns<IWeb3BalanceSchema[]>> => {

  log('listing Web3 raw balances')

  const { http = new Web3Http() } = params

  const balances = await http.publicRequest<IWeb3BalanceSchema[]>({
    url: '/balances/list',
  })

  const { requestCount } = http

  return {
    requestCount,
    balances,
  }

}
