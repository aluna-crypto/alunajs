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
import { handleFtxRequestError } from './errors/handleFtxRequestError'



export const FTX_HTTP_CACHE_KEY_PREFIX = 'FtxHttp.publicRequest'



export class FtxHttp implements IAlunaHttp {

  public settings: IAlunaSettingsSchema
  public requestWeight: IAlunaHttpRequestCount



  constructor(settings: IAlunaSettingsSchema) {

    this.requestWeight = {
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
      prefix: FTX_HTTP_CACHE_KEY_PREFIX,
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

    this.requestWeight.public += weight

    try {

      const { data } = await axios
        .create()
        .request<IFtxResponseSchema<T>>(requestConfig)

      const { result } = data

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, result, cacheTtlInSeconds)
      }

      return result

    } catch (error) {

      throw handleFtxRequestError({ error })

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

    this.requestWeight.authed += weight

    try {

      const { data } = await axios
        .create()
        .request<IFtxResponseSchema<T>>(requestConfig)

      const { result } = data

      return result

    } catch (error) {

      throw handleFtxRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
}

export interface IFtxSignedHeaders {
  'FTX-KEY': string
  'FTX-TS': number
  'FTX-SIGN': string
}

export interface IFtxResponseSchema<T> {
  success: boolean
  result: T
}

export const generateAuthHeader = (
  params: ISignedHashParams,
): IFtxSignedHeaders => {

  const {
    credentials,
    verb,
    body,
    url,
  } = params

  const path = new URL(url).pathname

  const {
    key,
    secret,
  } = credentials

  const timestamp = new Date().getTime()

  const signedHeader = crypto
    .createHmac('sha256', secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(path)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'FTX-KEY': key,
    'FTX-SIGN': signedHeader,
    'FTX-TS': timestamp,
  }

}
