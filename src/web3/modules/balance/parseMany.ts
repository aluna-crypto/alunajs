import debug from 'debug'
import {
  filter,
  flatten,
  map,
} from 'lodash'

import { AlunaWalletEnum } from '../../../lib/enums/AlunaWalletEnum'
import { IAlunaBalanceSchema } from '../../../lib/schemas/IAlunaBalanceSchema'
import { IDebankTokenSchema } from '../../schemas/IDebankTokenSchema'
import { IDebankTotalBalanceSchema } from '../../schemas/IDebankTotalBalanceSchema'
import { Web3 } from '../../Web3'



const log = debug('alunajs:web3/balance/parseMany')



export interface IWeb3BalanceParseManyParams {
  rawTotalBalance: IDebankTotalBalanceSchema
  rawTokenList: IDebankTokenSchema[]
}

export interface IWeb3BalanceParseManyReturns {
  balances: IAlunaBalanceSchema[]
}



export const parseMany = (web3: Web3) => (
  params: IWeb3BalanceParseManyParams,
): IWeb3BalanceParseManyReturns => {

  const {
    rawTotalBalance,
    rawTokenList,
  } = params

  const { chain_list: chains } = rawTotalBalance

  const balances: IAlunaBalanceSchema[] = flatten(map(chains, (chain) => {

    const tokens = filter(rawTokenList, { chain: chain.id })

    return map(tokens, (token) => {

      const { amount } = token

      const balance: IAlunaBalanceSchema = {
        symbolId: token.symbol,
        chainId: chain.id,
        wallet: AlunaWalletEnum.WEB3,
        total: amount,
        available: amount,
        meta: {
          chain_id: chain.id,
          token_symbol: token.symbol,
          token_display_symbol: token.display_symbol,
        },
      }

      return balance

    })

  }))

  log(`finished parsing ${balances.length} balances`)

  return { balances }

}
