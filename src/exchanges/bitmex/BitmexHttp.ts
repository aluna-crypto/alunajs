import axios from 'axios'
import crypto from 'crypto'

import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
  IAlunaHttpResponse,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { assembleAxiosRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { Bitmex } from './Bitmex'
import { handleBitmexRequestError } from './errors/handleBitmexRequestError'



export const BITMEX_HTTP_CACHE_KEY_PREFIX = 'BitmexHttp.publicRequest'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}



export interface IBitmexRequestHeaders {
  'api-expires': string
  'api-key': string
  'api-signature': string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
):IBitmexRequestHeaders => {

  const {
    keySecret,
    path,
    verb,
    body,
  } = params

  const {
    key,
    secret,
  } = keySecret

  const nonce = Date.now().toString()

  const signature = crypto
    .createHmac('sha256', secret)
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(nonce)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'api-expires': nonce,
    'api-key': key,
    'api-signature': signature,
  }

}



export const BitmexHttp: IAlunaHttp = class {

  static async publicRequest<T> (
    params: IAlunaHttpPublicParams,
  ): Promise<IAlunaHttpResponse<T>> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: BITMEX_HTTP_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return {
        data: AlunaCache.cache.get<T>(cacheKey)!,
        requestCount: 0,
      }

    }

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings: Bitmex.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleBitmexRequestError({ error })

    }

  }

  static async privateRequest<T> (
    params: IAlunaHttpPrivateParams,
  ): Promise<IAlunaHttpResponse<T>> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      keySecret,
      body,
    })

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings: Bitmex.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleBitmexRequestError({ error })

    }

  }

}
