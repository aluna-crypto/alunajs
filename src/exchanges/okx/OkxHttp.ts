import axios from 'axios'
import crypto from 'crypto'

import { AlunaError } from '../../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpPrivateParams,
  IAlunaHttpPublicParams,
  IAlunaHttpResponse,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaKeySecretSchema } from '../../lib/schemas/IAlunaKeySecretSchema'
import { assembleAxiosRequestConfig, IAssembleAxiosRequestConfigParams } from '../../utils/axios/assembleAxiosRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleOkxRequestError } from './errors/handleOkxRequestError'
import { Okx } from './Okx'



export const OKX_HTTP_CACHE_KEY_PREFIX = 'OkxHttp.publicRequest'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  keySecret: IAlunaKeySecretSchema
  body?: any
  query?: string
  path: string
}



export interface IOkxSignedSignature {
  'OK-ACCESS-KEY': string
  'OK-ACCESS-SIGN': string
  'OK-ACCESS-TIMESTAMP': string
  'OK-ACCESS-PASSPHRASE': string
  'Content-Type': string
}

interface IOkxHttpResponse<T> {
  code: string
  msg: string
  data: T
}


export const generateAuthSignature = (
  params: ISignedHashParams,
): IOkxSignedSignature => {

  const {
    keySecret,
    verb,
    path,
    query,
    body,
  } = params

  if (!keySecret.passphrase) {

    throw new AlunaError({
      code: AlunaKeyErrorCodes.INVALID,
      message: '\'passphrase\' is required for private requests',
      httpStatusCode: 401,
    })

  }

  const timestamp = new Date().toISOString()

  const pathWithQuery = query ? `${path}?${query}` : path

  const includeBody = body ? JSON.stringify(body) : ''

  const meta = [
    timestamp,
    verb.toUpperCase(),
    pathWithQuery,
    includeBody,
  ].join('')

  const signedRequest = crypto
    .createHmac('sha256', keySecret.secret)
    .update(meta)
    .digest('base64')

  return {
    'OK-ACCESS-KEY': keySecret.key,
    'OK-ACCESS-PASSPHRASE': keySecret.passphrase,
    'OK-ACCESS-SIGN': signedRequest,
    'OK-ACCESS-TIMESTAMP': timestamp,
    'Content-Type': 'application/json',
  }

}


export const OkxHttp: IAlunaHttp = class {

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
      prefix: OKX_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Okx.settings.proxySettings,
    })

    try {

      const { data } = await axios
        .create()
        .request<IOkxHttpResponse<T>>(requestConfig)

      const { data: response } = data

      AlunaCache.cache.set<T>(cacheKey, response)

      return {
        data: response,
        requestCount: 1,
      }

    } catch (error) {

      throw handleOkxRequestError({ error })

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
      query,
    } = params

    const path = new URL(url).pathname

    const signedHash = generateAuthSignature({
      verb,
      keySecret,
      body,
      query,
      path,
    })


    const fullUrl = query ? `${url}?${query}` : url

    const assembleRequestConfigRequest: IAssembleAxiosRequestConfigParams = {
      url: fullUrl,
      method: verb,
      headers: signedHash,
      proxySettings: Okx.settings.proxySettings,
    }

    if (body) {

      assembleRequestConfigRequest.data = body

    }

    const { requestConfig } = assembleAxiosRequestConfig(
      assembleRequestConfigRequest,
    )

    try {

      const { data } = await axios
        .create()
        .request<IOkxHttpResponse<T>>(requestConfig)

      const { data: response } = data

      return {
        data: response,
        requestCount: 1,
      }

    } catch (error) {

      throw handleOkxRequestError({ error })

    }

  }

}
