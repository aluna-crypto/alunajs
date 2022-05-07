import axios from 'axios'
import crypto from 'crypto'
import debug from 'debug'

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
import { handleValrRequestError } from './errors/handleValrRequestError'



export const VALR_HTTP_CACHE_KEY_PREFIX = 'ValrHttp.publicRequest'



const log = debug('@alunajs:valr/ValrHttp')


interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
}



export interface IValrSignedHeaders {
  'X-VALR-API-KEY': string
  'X-VALR-SIGNATURE': string
  'X-VALR-TIMESTAMP': number
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IValrSignedHeaders => {

  log('generateAuthHeader', params)

  const {
    credentials,
    verb,
    body,
    path,
  } = params

  const {
    key,
    secret,
  } = credentials

  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha512', secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'X-VALR-API-KEY': key,
    'X-VALR-SIGNATURE': signedRequest,
    'X-VALR-TIMESTAMP': timestamp,
  }

}



export class ValrHttp implements IAlunaHttp {

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
      prefix: VALR_HTTP_CACHE_KEY_PREFIX,
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

      throw handleValrRequestError({ error })

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
      verb,
      path: new URL(url).pathname,
      credentials,
      body,
      url,
    })

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash, // TODO: Review headers injection
      proxySettings: settings?.proxySettings,
    })

    this.requestCount.authed += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return data

    } catch (error) {

      throw handleValrRequestError({ error })

    }

  }

}
