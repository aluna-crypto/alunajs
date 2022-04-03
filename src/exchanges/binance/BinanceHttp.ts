import axios from 'axios'
import crypto from 'crypto'
import { URLSearchParams } from 'url'

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
import { Binance } from './Binance'
import { handleBinanceRequestError } from './errors/handleBinanceRequestError'



export const BINANCE_HTTP_CACHE_KEY_PREFIX = 'BinanceHttp.publicRequest'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  keySecret: IAlunaKeySecretSchema
  body?: any
  query?: string
}



interface IBinanceSecureHeaders {
  'X-MBX-APIKEY': string
}



export interface IBinanceSignedSignature {
  signature: string
  dataQueryString: string
  body: string
}



export const formatBodyToBinance = (body: Record<string, any>): string => {

  const formattedBody = new URLSearchParams()

  Object.keys(body).map((key) => {

    formattedBody.append(key, body[key])

    return key

  })

  const bodyStringified = `&${formattedBody.toString()}`

  return bodyStringified

}



export const generateAuthSignature = (
  params: ISignedHashParams,
): IBinanceSignedSignature => {

  const {
    keySecret,
    body,
    query,
  } = params

  const dataQueryString = `recvWindow=60000&timestamp=${Date.now()}`

  const formattedBody = body ? formatBodyToBinance(body) : ''

  const signedRequest = crypto
    .createHmac('sha256', keySecret.secret)
    .update(dataQueryString)
    .update(query || '')
    .update(formattedBody)
    .digest('hex')

  const dataQueryStringWithQuery = query
    ? dataQueryString + query
    : dataQueryString

  return {
    signature: signedRequest,
    dataQueryString: dataQueryStringWithQuery,
    body: formattedBody,
  }

}


export const BinanceHttp: IAlunaHttp = class {

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
      prefix: BINANCE_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Binance.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, response.data)

      return {
        data: response.data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleBinanceRequestError({ error })

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

    const signedHash = generateAuthSignature({
      verb,
      keySecret,
      body,
      query,
    })

    const urlParams = new URLSearchParams(
      `${signedHash.dataQueryString}${signedHash.body}`,
    )

    urlParams.append('signature', signedHash.signature)

    const fullUrl = `${url}?${urlParams.toString()}`

    const headers: IBinanceSecureHeaders = {
      'X-MBX-APIKEY': keySecret.key,
    }

    const { requestConfig } = assembleAxiosRequestConfig({
      url: fullUrl,
      method: verb,
      headers,
      proxySettings: Binance.settings.proxySettings,
    })

    try {

      const response = await axios.create().request<T>(requestConfig)

      return {
        data: response.data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleBinanceRequestError({ error })

    }

  }

}
