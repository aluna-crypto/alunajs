import debug from 'debug'
import { map } from 'lodash'

import { IAlunaHttpRequestCount } from '../../../../lib/core/IAlunaHttp'
import { IDebankTokenSchema } from '../../schemas/IDebankTokenSchema'
import { IWeb3TokenSchema } from '../../schemas/IWeb3TokenSchema'
import { Web3 } from '../../Web3'
import { Web3Http } from '../../Web3Http'
import { IWeb3TokenListRawParams } from './listRaw'



const log = debug('@aluna.js:web3/token/listRaw')



export interface IWeb3TokenListReturns {
  tokens: IWeb3TokenSchema[]
  requestCount: IAlunaHttpRequestCount
}



export const list = (module: Web3) => async (
  params: IWeb3TokenListRawParams,
): Promise<IWeb3TokenListReturns> => {

  log('listing Web3 raw tokens')

  const { http = new Web3Http() } = params

  const { rawTokens } = await module.token.listRaw({ ...params, http })

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
