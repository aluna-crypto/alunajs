import axios, {
  AxiosError,
  AxiosRequestConfig,
} from 'axios'
import crypto from 'crypto'
import { assign } from 'lodash'
import { URLSearchParams } from 'url'

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
import { Binance } from './Binance'
import { BinanceLog } from './BinanceLog'



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



export const handleRequestError = (param: AxiosError | Error): AlunaError => {

  let error: AlunaError

  const errorMsg = 'Error while trying to execute Axios request'

  if ((param as AxiosError).isAxiosError) {

    const {
      response,
    } = param as AxiosError

    error = new AlunaError({
      message: response?.data?.msg || errorMsg,
      httpStatusCode: response?.status,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      metadata: response?.data,
    })

  } else {

    error = new AlunaError({
      message: param.message || errorMsg,
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
    })

  }

  BinanceLog.error(error)

  return error

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

  static async publicRequest<T> (params: IAlunaHttpPublicParams): Promise<T> {

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

      return AlunaCache.cache.get<T>(cacheKey)!

    }

    let requestConfig: AxiosRequestConfig = {
      url,
      method: verb,
      data: body,
    }

    const { proxySettings } = Binance.settings

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

    let requestConfig: AxiosRequestConfig = {
      url: fullUrl,
      method: verb,
      headers,
    }

    const { proxySettings } = Binance.settings

    if (proxySettings) {

      const { agent, ...proxy } = proxySettings

      requestConfig = proxy.protocol === 'https'
        ? assign(requestConfig, { proxy, httpsAgent: agent })
        : assign(requestConfig, { proxy, httpAgent: agent })

    }


    try {

      const response = await axios.create().request<T>(requestConfig)

      return response.data

    } catch (error) {

      throw handleRequestError(error)

    }

  }

}
