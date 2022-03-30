import axios, { AxiosError } from 'axios'
import crypto from 'crypto'
import { URL } from 'url'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { assembleAxiosRequestConfig } from '../../utils/axios/assembleAxiosRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { Bittrex } from './Bittrex'
import { BittrexLog } from './BittrexLog'



export const BITTREX_HTTP_CACHE_KEY_PREFIX = 'BittrexHttp.publicRequest'


interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  keySecret: IAlunaKeySecretSchema
  url: string
  body?: any
}

export interface IBittrexSignedHeaders {
    'Api-Key': string
    'Api-Timestamp': number
    'Api-Content-Hash': string
    'Api-Signature': string
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

  BittrexLog.error(error)

  return error

}

export const generateAuthHeader = (
  params: ISignedHashParams,
): IBittrexSignedHeaders => {

  const {
    keySecret, verb, body, url,
  } = params

  const timestamp = new Date().getTime()

  const contentHash = crypto
    .createHash('sha512')
    .update(body ? JSON.stringify(body) : '')
    .digest('hex')

  const preSigned = [timestamp, url, verb.toUpperCase(), contentHash].join('')

  const signedHeader = crypto
    .createHmac('sha512', keySecret.secret)
    .update(preSigned)
    .digest('hex')

  return {
    'Api-Content-Hash': contentHash,
    'Api-Key': keySecret.key,
    'Api-Signature': signedHeader,
    'Api-Timestamp': timestamp,
  }

}

export const BittrexHttp: IAlunaHttp = class {

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
    } = params

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: BITTREX_HTTP_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return AlunaCache.cache.get<T>(cacheKey)!

    }

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings: Bittrex.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, response.data)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

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
      url,
    })

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash,
      proxySettings: Bittrex.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
