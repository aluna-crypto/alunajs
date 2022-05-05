import axios from 'axios'
import crypto from 'crypto'

import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { assembleRequestConfig } from '../../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleBitfinexRequestError } from './errors/handleBitfinexRequestError'



export const BITFINEX_HTTP_CACHE_KEY_PREFIX = 'BitfinexHttp.publicRequest'



interface ISignedHashParams {
  url: string
  body?: Record<any, any>
  credentials: IAlunaCredentialsSchema
}



export interface IBitfinexSignedHeaders {
  'Content-Type': string
  'bfx-nonce': string
  'bfx-apikey': string
  'bfx-signature': string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IBitfinexSignedHeaders => {

  const {
    credentials,
    body,
    url,
  } = params

  const {
    key,
    secret,
  } = credentials

  const path = new URL(url).pathname

  const nonce = (Date.now() * 1000).toString()

  const payload = `/api${path}${nonce}${body ? JSON.stringify(body) : ''}`

  const sig = crypto.createHmac('sha384', secret)
    .update(payload)
    .digest('hex')

  const headers: IBitfinexSignedHeaders = {
    'Content-Type': 'application/json',
    'bfx-nonce': nonce,
    'bfx-apikey': key,
    'bfx-signature': sig,
  }

  return headers

}



export class BitfinexHttp implements IAlunaHttp {

  public requestCount: IAlunaHttpRequestCount



  constructor() {

    this.requestCount = {
      authed: 0,
      public: 0,
    }

  }



  public async publicRequest <T>(
    params: IAlunaHttpPublicParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
      settings,
    } = params

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: BITFINEX_HTTP_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return AlunaCache.cache.get<T>(cacheKey) as T

    }

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings: settings?.proxySettings,
    })

    this.requestCount.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return data

    } catch (error) {

      throw handleBitfinexRequestError({ error })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      credentials,
      settings,
      weight = 1,
    } = params

    const signedHash = generateAuthHeader({
      credentials,
      body,
      url,
    })

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings: settings?.proxySettings,
    })

    this.requestCount.authed += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return data

    } catch (error) {

      throw handleBitfinexRequestError({ error })

    }

  }

}
