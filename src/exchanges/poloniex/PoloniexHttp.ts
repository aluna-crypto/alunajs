import axios, { AxiosError } from 'axios'
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
import { handlePoloniexRequestError } from './errors/handlePoloniexRequestError'
import { Poloniex } from './Poloniex'



export const POLONIEX_HTTP_CACHE_KEY_PREFIX = 'PoloniexHttp.publicRequest'



interface ISignedHashParams {
  keySecret: IAlunaKeySecretSchema
  body?: any
}



export interface IPoloniexSignedHeaders {
    'Key': string
    'Sign': string
    'Content-Type': string
}



export const generateAuthSignature = (
  params: ISignedHashParams,
): IPoloniexSignedHeaders => {

  const {
    keySecret,
    body,
  } = params

  const signedHeader = crypto
    .createHmac('sha512', keySecret.secret)
    .update(body ? body.toString() : '')
    .digest('hex')

  return {
    Key: keySecret.key,
    Sign: signedHeader,
    'Content-Type': 'application/x-www-form-urlencoded',
  }

}

export const PoloniexHttp: IAlunaHttp = class {

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
      prefix: POLONIEX_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Poloniex.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handlePoloniexRequestError({ error })

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
    })

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings: Poloniex.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      if ((response.data as any).success === 0) {

        const error = {
          isAxiosError: true,
          response,
        } as AxiosError

        throw error

      }

      return {
        data: response.data,
        requestCount: 1,
      }

    } catch (error) {

      throw handlePoloniexRequestError({ error })

    }

  }

}
