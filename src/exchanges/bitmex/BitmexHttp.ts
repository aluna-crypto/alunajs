import axios, {
  AxiosError,
  AxiosRequestConfig,
} from 'axios'
import crypto from 'crypto'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { Bitmex } from './Bitmex'



export const BITMEX_HTTP_CACHE_KEY_PREFIX = 'BitmexHttp.publicRequest'



export const bitmexRequestErrorHandler = (
  param: AxiosError | Error,
): AlunaError => {

  let error: AlunaError

  const message = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.error?.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: response?.status,
    })

  } else {

    error = new AlunaError({
      message: param.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

  }

  return error

}



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}



interface IBitmexRequestHeaders {
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

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

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

      return AlunaCache.cache.get<T>(cacheKey)!

    }

    const { proxyAgent } = Bitmex.settings

    const requestConfig: AxiosRequestConfig = {
      url,
      method: verb,
      data: body,
      ...(proxyAgent ? { httpsAgent: proxyAgent } : {}),
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, response.data)

      return response.data

    } catch (error) {

      throw bitmexRequestErrorHandler(error)

    }

  }

  static async privateRequest<T> (params: IAlunaHttpPrivateParams): Promise<T> {

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

    const { proxyAgent } = Bitmex.settings

    const requestConfig: AxiosRequestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
      ...(proxyAgent ? { httpsAgent: proxyAgent } : {}),
    }

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw bitmexRequestErrorHandler(error)

    }

  }

}
