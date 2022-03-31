import axios, { AxiosError } from 'axios'
import crypto from 'crypto'

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
import { Bitfinex } from './Bitfinex'



export const BITFINEX_HTTP_CACHE_KEY_PREFIX = 'BitfinexHttp.publicRequest'


export interface IBitfinexSignedHashParams {
  body: Record<string, any>
  url: string
  keySecret: IAlunaKeySecretSchema
}



export interface IBitfinexSignedV1Headers {
  'Content-Type': string
  'X-BFX-APIKEY': string
  'X-BFX-PAYLOAD': string
  'X-BFX-SIGNATURE': string
}



export interface IBitfinexSignedV2Headers {
  'Content-Type': string
  'bfx-nonce': string
  'bfx-apikey': string
  'bfx-signature': string
}



export interface IGenerateAuthHeaderReturns {
  headers: IBitfinexSignedV1Headers | IBitfinexSignedV2Headers
  body: Record<string, any>
}



export const generateAuthHeader = (
  params: IBitfinexSignedHashParams,
): IGenerateAuthHeaderReturns => {

  const {
    url,
    keySecret,
    body,
  } = params

  const {
    key,
    secret,
  } = keySecret

  const path = new URL(url).pathname

  const nonce = (Date.now() * 1000).toString()

  let headers: IBitfinexSignedV1Headers | IBitfinexSignedV2Headers

  if (/v2/.test(path)) {

    const payload = `/api${path}${nonce}${JSON.stringify(body)}`

    const sig = crypto.createHmac('sha384', secret)
      .update(payload)
      .digest('hex')

    headers = {
      'Content-Type': 'application/json',
      'bfx-nonce': nonce,
      'bfx-apikey': key,
      'bfx-signature': sig,
    }

  } else {

    body.request = path
    body.nonce = nonce

    const payload = Buffer.from(JSON.stringify(body)).toString('base64')

    const sig = crypto.createHmac('sha384', secret)
      .update(payload)
      .digest('hex')

    headers = {
      'Content-Type': 'application/json',
      'X-BFX-APIKEY': key,
      'X-BFX-PAYLOAD': payload,
      'X-BFX-SIGNATURE': sig,
    }

  }

  const output: IGenerateAuthHeaderReturns = {
    body,
    headers,
  }

  return output

}



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  let message = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    if (response?.request?.path.match(new RegExp(/v1/))) {

      message = response.data.message

    }

    error = new AlunaError({
      message: response?.data?.[2] || message,
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

  return error

}



export const BitfinexHttp: IAlunaHttp = class {

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
      prefix: BITFINEX_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Bitfinex.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

    }

  }

  static async privateRequest<T> (
    params: IAlunaHttpPrivateParams,
  ): Promise<IAlunaHttpResponse<T>> {

    const {
      url,
      body = {},
      verb = AlunaHttpVerbEnum.POST,
      keySecret,
    } = params

    const signedHash = generateAuthHeader({
      url,
      keySecret,
      body,
    })

    const { requestConfig } = assembleAxiosRequestConfig({
      url,
      method: verb,
      data: signedHash.body,
      headers: signedHash.headers,
      proxySettings: Bitfinex.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
