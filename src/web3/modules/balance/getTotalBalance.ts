import debug from 'debug'
import {
  filter,
  map,
} from 'lodash'

import { AlunaError } from '../../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../lib/core/IAlunaHttp'
import { AlunaHttpErrorCodes } from '../../../lib/errors/AlunaHttpErrorCodes'
import { IDebankChainSchema } from '../../schemas/IDebankChainSchema'
import { IDebankTotalBalanceSchema } from '../../schemas/IDebankTotalBalanceSchema'
import { IWeb3ChainSchema } from '../../schemas/IWeb3ChainSchema'
import { IWeb3TotalBalanceSchema } from '../../schemas/IWeb3TotalBalanceSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@aluna.js:web3/balance/getTotalBalanceRaw')



export interface IWeb3GetTotalBalanceParams {
  http?: IAlunaHttp
  address: string
}

export interface IWeb3GetTotalBalanceReturns {
  totalBalance: IWeb3TotalBalanceSchema
  requestCount: IAlunaHttpRequestCount
}



const DEBANK_API_URL = 'https://openapi.debank.com/'



export const getTotalBalance = (web3: Web3) => async (
  params: IWeb3GetTotalBalanceParams,
): Promise<IWeb3GetTotalBalanceReturns> => {

  log('getting Web3 total balance')

  const {
    address,
    http = new Web3Http(),
  } = params

  const url = [
    `${DEBANK_API_URL}v1/user/total_balance?`,
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
      message: 'Error getting getTotalBalance of web3 tokens for user.',
      metadata: error,
    })

  }

  const { parsedTotalBalance } = await parseTotalBalance({ rawTotalBalance })

  const { requestCount } = http

  return {
    requestCount,
    totalBalance: parsedTotalBalance,
  }

}



export const parseTotalBalance = async (params: {
  rawTotalBalance: IDebankTotalBalanceSchema
}): Promise<{ parsedTotalBalance: IWeb3TotalBalanceSchema }> => {

  const { rawTotalBalance } = params

  const {
    total_usd_value: totalUsdValue,
    chain_list: rawChainList,
  } = rawTotalBalance

  const chainList: IWeb3ChainSchema[] = map(rawChainList, ({
    id,
    community_id: communityId,
    name,
    native_token_id: nativeTokenId,
    logo_url: logoUrl,
    wrapped_token_id: wrappedTokenId,
    usd_value: usdValue,
  }: IDebankChainSchema) => ({
    id,
    communityId,
    name,
    nativeTokenId,
    logoUrl,
    wrappedTokenId,
    usdValue,
  }))

  const parsedTotalBalance: IWeb3TotalBalanceSchema = {
    totalUsdValue,
    chains: filter(chainList, (chain: IWeb3ChainSchema) => {
      return chain.usdValue !== 0
    }),
  }

  return { parsedTotalBalance }

}
