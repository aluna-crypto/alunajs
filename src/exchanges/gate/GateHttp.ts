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
import { handleGateRequestError } from './errors/handleGateRequestError'



export const GATE_HTTP_CACHE_KEY_PREFIX = 'GateHttp.publicRequest'



export class GateHttp implements IAlunaHttp {

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
      prefix: GATE_HTTP_CACHE_KEY_PREFIX,
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

      throw handleGateRequestError({ error })

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

      throw handleGateRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  credentials: IAlunaCredentialsSchema
  verb: AlunaHttpVerbEnum
  path: string
  url: string
  body?: any
}

export interface IGateSignedHeaders {
  'KEY': string
  'Timestamp': string
  'SIGN': string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IGateSignedHeaders => {

  const {
    credentials,
    verb,
    body,
    path,
    url,
  } = params

  const {
    key,
    secret,
  } = credentials

  const query = url.includes('?') ? url.split('?')[1] : ''

  const timestamp = (new Date().getTime() / 1000).toString()

  const hashedPayload = crypto
    .createHash('sha512')
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  const preSigned = [
    verb.toUpperCase(),
    path,
    query,
    hashedPayload,
    timestamp,
  ].join('\n')

  const signedHeader = crypto
    .createHmac('sha512', secret)
    .update(preSigned)
    .digest('hex')

  return {
    KEY: key,
    SIGN: signedHeader,
    Timestamp: timestamp,
  }

}
