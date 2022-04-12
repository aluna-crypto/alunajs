import axios from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

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
import { handleGateioRequestError } from './errors/handleGateioRequestError'
import { Gateio } from './Gateio'



export const GATEIO_HTTP_CACHE_KEY_PREFIX = 'GateioHttp.publicRequest'


interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  url: string
  body?: any
  query?: string
}

export interface IGateioSignedHeaders {
    'KEY': string
    'Timestamp': string
    'SIGN': string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IGateioSignedHeaders => {

  const {
    keySecret,
    verb,
    body,
    path,
    query = '',
  } = params

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
    .createHmac('sha512', keySecret.secret)
    .update(preSigned)
    .digest('hex')

  return {
    KEY: keySecret.key,
    SIGN: signedHeader,
    Timestamp: timestamp,
  }

}

export const GateioHttp: IAlunaHttp = class {

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
      prefix: GATEIO_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Gateio.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleGateioRequestError({ error })

    }

  }

  static async privateRequest<T> (params: IAlunaHttpPrivateParams)
    : Promise<IAlunaHttpResponse<T>> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const query = url.includes('?') ? url.split('?')[1] : ''

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      keySecret,
      body,
      url,
      query,
    })

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings: Gateio.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleGateioRequestError({ error })

    }

  }

}
