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
import {
  assembleAxiosRequestConfig,
  IAssembleAxiosRequestConfigParams,
} from '../../utils/axios/assembleAxiosRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleFtxRequestError } from './errors/handleFtxRequestError'
import { Ftx } from './Ftx'



export const FTX_HTTP_CACHE_KEY_PREFIX = 'FtxHttp.publicRequest'



interface ISignedHashParams {
  keySecret: IAlunaKeySecretSchema
  verb: AlunaHttpVerbEnum
  body?: any
  path: string
}

export interface IFtxSignedHeaders {
  'FTX-KEY': string
  'FTX-TS': number
  'FTX-SIGN': string
}

export const generateAuthSignature = (
  params: ISignedHashParams,
): IFtxSignedHeaders => {

  const {
    keySecret,
    body,
    verb,
    path,
  } = params

  const timestamp = new Date().getTime()

  const signedHeader = crypto
    .createHmac('sha256', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(path)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')


  return {
    'FTX-KEY': keySecret.key,
    'FTX-SIGN': signedHeader,
    'FTX-TS': timestamp,
  }

}

export const FtxHttp: IAlunaHttp = class {

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
      prefix: FTX_HTTP_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return {
        data: AlunaCache.cache.get<T>(cacheKey)!,
        requestCount: 0,
      }

    }

    const { requestConfig } = assembleAxiosRequestConfig({
      method: verb,
      url,
      data: body,
      proxySettings: Ftx.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleFtxRequestError({
        error,
      })

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

    const signedHash = generateAuthSignature({
      keySecret,
      body,
      verb,
      path: new URL(url).pathname,
    })

    const axiosRequestConfigRequest: IAssembleAxiosRequestConfigParams = {
      url,
      method: verb,
      headers: signedHash,
      proxySettings: Ftx.settings.proxySettings,
      data: body,
    }

    const { requestConfig } = assembleAxiosRequestConfig(
      axiosRequestConfigRequest,
    )

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleFtxRequestError({
        error,
      })

    }

  }

}
