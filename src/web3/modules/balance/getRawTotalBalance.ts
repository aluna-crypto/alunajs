import debug from 'debug'
import { filter } from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../lib/core/IAlunaHttp'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { IDebankChainSchema } from '../../schemas/IDebankChainSchema'
import { IDebankTotalBalanceSchema } from '../../schemas/IDebankTotalBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { DEBANK_API_URL } from '../../web3Settings'



const log = debug('@aluna.js:web3/balance/getRawTotalBalance')



export interface IWeb3GetRawTotalBalanceParams {
  http?: IAlunaHttp
  address: string
}

export interface IWeb3GetRawTotalBalanceReturns {
  rawTotalBalance: IDebankTotalBalanceSchema
  requestCount: IAlunaHttpRequestCount
}



export const getRawTotalBalance = (web3: Web3) => async (
  params: IWeb3GetRawTotalBalanceParams,
): Promise<IWeb3GetRawTotalBalanceReturns> => {

  log('getting Web3 raw total balance')

  const {
    address,
    http = new Web3Http(),
  } = params

  const url = [
    `${DEBANK_API_URL}/user/total_balance?`,
    `id=${address}`,
  ].join('')

  let rawTotalBalance: IDebankTotalBalanceSchema

  try {

    rawTotalBalance = await http.publicRequest<IDebankTotalBalanceSchema>({
      url,
    })

  } catch (error) {

    throw new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Error when getting Web3 raw total balance.',
      metadata: error,
    })

  }

  const { chain_list: chainList } = rawTotalBalance

  // filter out chains with zeroed balances
  rawTotalBalance.chain_list = filter(
    chainList,
    (chain: IDebankChainSchema) => (chain.usd_value !== 0),
  )

  const { requestCount } = http

  return {
    requestCount,
    rawTotalBalance,
  }

}
