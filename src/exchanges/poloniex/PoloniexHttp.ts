import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
  IAlunaHttpResponseWithRequestCount,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { PoloniexLog } from './PoloniexLog'



export const POLONIEX_HTTP_CACHE_KEY_PREFIX = 'PoloniexHttp.publicRequest'



interface ISignedHashParams {
  keySecret: IAlunaKeySecretSchema
  body?: any
}

interface IPoloniexResponseWithError {
  error: string
}

interface IPoloniexSignedHeaders {
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

  static async publicRequest<T> (params: IAlunaHttpPublicParams)
    : Promise<IAlunaHttpResponseWithRequestCount<T>> {

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
        apiRequestCount: 0,
      }

    }

    const requestConfig = {
      url,
      method: verb,
      data: body,
    }

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        apiRequestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

    }

  }

  static async privateRequest<T> (params: IAlunaHttpPrivateParams)
    : Promise<IAlunaHttpResponseWithRequestCount<T>> {

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

    const requestConfig = {
      url,
      method: verb,
      data: body,
      headers: signedHash,
    }

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      const isError = ((data as unknown) as IPoloniexResponseWithError).error

      if (isError) {

        const error = new Error(isError)

        throw handleRequestError(error)

      }

      return {
        data,
        apiRequestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
