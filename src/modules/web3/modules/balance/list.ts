import {
  filter,
  flatten,
  map,
  omit,
} from 'lodash'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../../lib/core/IAlunaHttp'
import { IWeb3BalanceSchema } from '../../schemas/IWeb3BalanceSchema'
import { IWeb3TokenSchema } from '../../schemas/IWeb3TokenSchema'
import { IWeb3TotalBalanceSchema } from '../../schemas/IWeb3TotalBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



// const log = debug('@aluna.js:web3/balance/listRaw')



export interface IWeb3BalanceListParams {
  http?: IAlunaHttp
  address: string
  chainId: string
}

export interface IWeb3BalanceListReturns {
  balances: IWeb3BalanceSchema[]
  requestCount: IAlunaHttpRequestCount
}



export const list = (module: Web3) => async (
  params: IWeb3BalanceListParams,
): Promise<IWeb3BalanceListReturns> => {

  const {
    address,
    http = new Web3Http(),
  } = params

  const { totalBalance } = await module.balance.getTotalBalance({
    address,
    http,
  })

  const { chains } = totalBalance

  const promises = map(chains, ({ id: chainId }) => {
    return module.token.list({ address, chainId })
  })

  const tokenList = flatten(map(await Promise.all(promises), 'tokens'))

  const { parsedBalances } = await parseBalances({
    totalBalance,
    tokenList,
  })

  const { requestCount } = http

  return {
    requestCount,
    balances: parsedBalances,
  }

}



export const parseBalances = async (params: {
  totalBalance: IWeb3TotalBalanceSchema
  tokenList: IWeb3TokenSchema[]
}): Promise<{ parsedBalances: IWeb3BalanceSchema[] }> => {

  const {
    totalBalance,
    tokenList,
  } = params

  const { chains } = totalBalance

  const parsedBalances: IWeb3BalanceSchema[] = map(chains, (chain) => {


    const balance: IWeb3BalanceSchema = {
      chain: omit(chain, 'meta'),
      tokens: filter(tokenList, { chain: chain.id }),
    }

    return balance

  })

  return { parsedBalances }

}
