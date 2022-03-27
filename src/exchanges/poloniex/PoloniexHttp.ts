import axios, {
  AxiosError,
  AxiosRequestConfig,
} from 'axios'
import crypto from 'crypto'
import { assign } from 'lodash'

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
import { Poloniex } from './Poloniex'
import { PoloniexLog } from './PoloniexLog'



export const POLONIEX_HTTP_CACHE_KEY_PREFIX = 'PoloniexHttp.publicRequest'



interface ISignedHashParams {
  keySecret: IAlunaKeySecretSchema
  body?: any
}

interface IPoloniexResponseWithError {
  error: string
}

export interface IPoloniexSignedHeaders {
    'Key': string
    'Sign': string
    'Content-Type': string
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

  PoloniexLog.error(error)

  return error

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

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

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

      return AlunaCache.cache.get<T>(cacheKey)!

    }

    let requestConfig: AxiosRequestConfig = {
      url,
      method: verb,
      data: body,
    }

    const { proxySettings } = Poloniex.settings

    if (proxySettings) {

      const { agent, ...proxy } = proxySettings

      requestConfig = proxy.protocol === 'https'
        ? assign(requestConfig, { proxy, httpsAgent: agent })
        : assign(requestConfig, { proxy, httpAgent: agent })

    }

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

    const signedHash = generateAuthSignature({
      keySecret,
      body,
    })

    let requestConfig: AxiosRequestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
    }

    const { proxySettings } = Poloniex.settings

    if (proxySettings) {

      const { agent, ...proxy } = proxySettings

      requestConfig = proxy.protocol === 'https'
        ? assign(requestConfig, { proxy, httpsAgent: agent })
        : assign(requestConfig, { proxy, httpAgent: agent })

    }

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      const isError = ((data as unknown) as IPoloniexResponseWithError).error

      if (isError) {

        const error = new Error(isError)

        throw handleRequestError(error)

      }

      return data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
