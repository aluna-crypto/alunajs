import debug from 'debug'

import { AlunaError } from '../../../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../../lib/core/IAlunaHttp'
import { AlunaHttpErrorCodes } from '../../../../lib/errors/AlunaHttpErrorCodes'
import { IDebankTokenSchema } from '../../schemas/IDebankTokenSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'



const log = debug('@aluna.js:web3/token/listRaw')



export interface IWeb3TokenListRawParams {
  http?: IAlunaHttp
  address: string
  chainId: string
}

export interface IWeb3TokenListRawReturns {
  rawTokens: IDebankTokenSchema[]
  requestCount: IAlunaHttpRequestCount
}



const DEBANK_API_URL = 'https://openapi.debank.com/'



export const listRaw = (module: Web3) => async (
  params: IWeb3TokenListRawParams,
): Promise<IWeb3TokenListRawReturns> => {

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

  const { requestCount } = http

  return {
    requestCount,
    rawTokens,
  }

}
