import debug from 'debug'
import { map } from 'lodash'

import { AlunaError } from '../../../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../../lib/core/IAlunaHttp'
import { AlunaHttpErrorCodes } from '../../../../lib/errors/AlunaHttpErrorCodes'
import { IDebankTokenSchema } from '../../schemas/IDebankTokenSchema'
import { IWeb3TokenSchema } from '../../schemas/IWeb3TokenSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@aluna.js:web3/token/listRaw')



export interface IWeb3TokenListParams {
  http?: IAlunaHttp
  address: string
  chainId: string
}

export interface IWeb3TokenListReturns {
  tokens: IWeb3TokenSchema[]
  requestCount: IAlunaHttpRequestCount
}



const DEBANK_API_URL = 'https://openapi.debank.com/'



export const list = (module: Web3) => async (
  params: IWeb3TokenListParams,
): Promise<IWeb3TokenListReturns> => {

  log('listing Web3 raw tokens')

  const {
    address,
    chainId,
    http = new Web3Http(),
  } = params

  const url = [
    `${DEBANK_API_URL}v1/user/token_list?`,
    `id=${address}`,
    `&chain_id=${chainId}`,
    '&is_all=false',
    '&has_token=true',
  ].join('')

  let rawTokens: IDebankTokenSchema[]

  try {

    rawTokens = await http.publicRequest<IDebankTokenSchema[]>({ url })

  } catch (error) {

    throw new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'Error getting list of web3 tokens for user.',
      metadata: error,
    })

  }

  const { parsedTokens } = await parseTokens({ rawTokens })

  const { requestCount } = http

  return {
    requestCount,
    tokens: parsedTokens,
  }

}



export const parseTokens = async (params: {
  rawTokens: IDebankTokenSchema[]
}): Promise<{ parsedTokens: IWeb3TokenSchema[] }> => {

  const { rawTokens } = params

  const parsedTokens: IWeb3TokenSchema[] = map(rawTokens, (rawToken) => {
    return {
      id: rawToken.id,
      chain: rawToken.chain,
      name: rawToken.name,
      symbol: rawToken.symbol,
      meta: rawToken,
    }
  })

  return { parsedTokens }

}
