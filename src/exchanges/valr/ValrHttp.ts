import axios, { AxiosError } from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
  IAlunaHttpResponse,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { assembleAxiosRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { Valr } from './Valr'
import { ValrLog } from './ValrLog'



export const VALR_HTTP_CACHE_KEY_PREFIX = 'ValrHttp.publicRequest'


interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  body?: any
}

export interface IValrSignedHeaders {
  'X-VALR-API-KEY': string
  'X-VALR-SIGNATURE': string
  'X-VALR-TIMESTAMP': number
}

export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const message = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      httpStatusCode: response?.status,
      metadata: response?.data,
    })

  } else {

    error = new AlunaError({
      message: param.message || message,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

  }

  ValrLog.error(error)

  return error

}

export const generateAuthHeader = (
  params: ISignedHashParams,
):IValrSignedHeaders => {

  const {
    keySecret, path, verb, body,
  } = params

  const timestamp = Date.now()

  const signedRequest = crypto
    .createHmac('sha512', keySecret.secret)
    .update(timestamp.toString())
    .update(verb.toUpperCase())
    .update(`${path}`)
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  return {
    'X-VALR-API-KEY': keySecret.key,
    'X-VALR-SIGNATURE': signedRequest,
    'X-VALR-TIMESTAMP': timestamp,
  }

}

export const ValrHttp: IAlunaHttp = class {

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
      prefix: VALR_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Valr.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, response.data)

      return {
        data: response.data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

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
      proxySettings: Valr.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      const { data } = response

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
