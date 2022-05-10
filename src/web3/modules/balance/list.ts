import { debug } from 'debug'
import {
  flatten,
  map,
} from 'lodash'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../lib/core/IAlunaHttp'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@alunajs:web3/balance/list')



export interface IWeb3BalanceListParams {
  http?: IAlunaHttp
  address: string
}

export interface IWeb3BalanceListReturns {
  balances: IAlunaBalanceSchema[]
  requestWeight: IAlunaHttpRequestCount
}



export const list = (web3: Web3) => async (
  params: IWeb3BalanceListParams,
): Promise<IWeb3BalanceListReturns> => {

  log('listing web3 raw balances')

  const {
    address,
    http = new Web3Http(web3.settings),
  } = params

  const { rawTotalBalance } = await web3.balance.getRawTotalBalance({
    address,
    http,
  })

  const { chain_list: chainList } = rawTotalBalance

  const promises = map(chainList, ({ id: chainId }) => web3.token.listRaw({
    address,
    chainId,
    http,
  }))

  const rawTokenList = flatten(map(await Promise.all(promises), 'rawTokens'))

  const { balances } = await web3.balance.parseMany({
    rawTotalBalance,
    rawTokenList,
  })

  const { requestWeight } = http

  return {
    requestWeight,
    balances,
  }

}
