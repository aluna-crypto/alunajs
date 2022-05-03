import { debug } from 'debug'
import {
  filter,
  flatten,
  map,
} from 'lodash'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../lib/core/IAlunaHttp'
import { AlunaWalletEnum } from '../../../lib/enums/AlunaWalletEnum'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { IWeb3TokenSchema } from '../../schemas/IWeb3TokenSchema'
import { IWeb3TotalBalanceSchema } from '../../schemas/IWeb3TotalBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@aluna.js:web3/balance/listRaw')



export interface IWeb3BalanceListParams {
  http?: IAlunaHttp
  address: string
}

export interface IWeb3BalanceListReturns {
  balances: IAlunaBalanceSchema[]
  requestCount: IAlunaHttpRequestCount
}



export const list = (web3: Web3) => async (
  params: IWeb3BalanceListParams,
): Promise<IWeb3BalanceListReturns> => {

  log('listing web3 raw balances')

  const {
    address,
    http = new Web3Http(),
  } = params

  const { totalBalance } = await web3.balance.getTotalBalance({
    address,
    http,
  })

  const { chains } = totalBalance

  const promises = map(chains, ({ id: chainId }) => web3.token.list({
    address,
    chainId,
    http,
  }))

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
}): Promise<{ parsedBalances: IAlunaBalanceSchema[] }> => {

  const {
    totalBalance,
    tokenList,
  } = params

  const { chains } = totalBalance

  const parsedBalances: IAlunaBalanceSchema[] = flatten(map(chains, (chain) => {

    const tokens = filter(tokenList, { chain: chain.id })

    return map(tokens, (token) => {

      const { amount } = token

      const balance: IAlunaBalanceSchema = {
        symbolId: token.symbol,
        chainId: chain.id,
        wallet: AlunaWalletEnum.WEB3,
        total: amount,
        available: amount,
        meta: {
          totalBalance,
          tokenList,
        },
      }

      return balance

    })

  }))

  return { parsedBalances }

}
