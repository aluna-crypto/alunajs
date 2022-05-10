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
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { assembleRequestConfig } from '../../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleBittrexRequestError } from './errors/handleBittrexRequestError'



export const BITTREX_HTTP_CACHE_KEY_PREFIX = 'BittrexHttp.publicRequest'



export class BittrexHttp implements IAlunaHttp {

  public settings: IAlunaSettingsSchema
  public requestCount: IAlunaHttpRequestCount



  constructor(settings: IAlunaSettingsSchema) {

    this.requestCount = {
      authed: 0,
      public: 0,
    }

    this.settings = settings

  }



  public async publicRequest <T>(
    params: IAlunaHttpPublicParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const {
      disableCache = false,
      cacheTtlInSeconds = 60,
    } = settings

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: BITTREX_HTTP_CACHE_KEY_PREFIX,
    })

    if (!disableCache && AlunaCache.cache.has(cacheKey)) {
      return AlunaCache.cache.get<T>(cacheKey) as T
    }

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings,
    })

    this.requestCount.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, data, cacheTtlInSeconds)
      }

      return data

    } catch (error) {

      throw handleBittrexRequestError({ error })

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
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      credentials,
      body,
      url,
    })

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings,
    })

    this.requestCount.authed += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return data

    } catch (error) {

      throw handleBittrexRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
}

export interface IBittrexSignedHeaders {
  'Api-Key': string
  'Api-Timestamp': number
  'Api-Content-Hash': string
  'Api-Signature': string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IBittrexSignedHeaders => {

  const {
    credentials,
    verb,
    body,
    url,
  } = params

  const timestamp = new Date().getTime()

  const {
    key,
    secret,
  } = credentials

  const contentHash = crypto
    .createHash('sha512')
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  const preSigned = [timestamp, url, verb.toUpperCase(), contentHash].join('')

  const signedHeader = crypto
    .createHmac('sha512', secret)
    .update(preSigned)
    .digest('hex')

  return {
    'Api-Content-Hash': contentHash,
    'Api-Key': key,
    'Api-Signature': signedHeader,
    'Api-Timestamp': timestamp,
  }

}
