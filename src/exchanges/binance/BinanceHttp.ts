import axios from 'axios'
import crypto from 'crypto'

import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { assembleRequestConfig } from '../../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../../utils/cache/AlunaCache'
import { handleBinanceRequestError } from './errors/handleBinanceRequestError'



export const BINANCE_HTTP_CACHE_KEY_PREFIX = 'BinanceHttp.publicRequest'



export class BinanceHttp implements IAlunaHttp {

  public settings: IAlunaSettingsSchema
  public requestWeight: IAlunaHttpRequestCount



  constructor(settings: IAlunaSettingsSchema) {

    this.requestWeight = {
      authed: 0,
      public: 0,
    }

    this.settings = settings

  }



  public async publicRequest <T>(
    params: IAlunaHttpPublicParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const {
      disableCache = false,
      cacheTtlInSeconds = 60,
    } = settings

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: BINANCE_HTTP_CACHE_KEY_PREFIX,
    })

    if (!disableCache && AlunaCache.cache.has(cacheKey)) {
      return AlunaCache.cache.get<T>(cacheKey) as T
    }

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings,
    })

    this.requestWeight.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, data, cacheTtlInSeconds)
      }

      return data

    } catch (error) {

      throw handleBinanceRequestError({ error })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.POST,
      credentials,
      weight = 1,
      query,
    } = params

    const settings = (params.settings || this.settings)

    const signedHash = generateAuthHeader({
      credentials,
      body,
      url,
      query,
    })

    const {
      signedHeader,
      signedUrl,
    } = signedHash

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url: signedUrl,
      method: verb,
      headers: signedHeader,
      proxySettings,
    })

    this.requestWeight.authed += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return data

    } catch (error) {

      throw handleBinanceRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
  query?: string
}


export interface IBinanceSignedHeaders {
  'X-MBX-APIKEY': string
}

export interface IBinanceSignedSignature {
  signedUrl: string
  signedHeader: IBinanceSignedHeaders
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



export const generateAuthHeader = (
  params: ISignedHashParams,
): IBinanceSignedSignature => {

  const {
    credentials,
    body,
    query,
    url,
  } = params

  const {
    key,
    secret,
  } = credentials

  const queryParams = `recvWindow=60000&timestamp=${Date.now()}`

  const stringifiedBody = body ? formatBodyToBinance(body) : ''

  const signedRequest = crypto
    .createHmac('sha256', secret)
    .update(queryParams)
    .update(query || '')
    .update(stringifiedBody)
    .digest('hex')

  const queryParamsWithQuery = query
    ? queryParams + query
    : queryParams

  const urlParams = new URLSearchParams(
    `${queryParamsWithQuery}${stringifiedBody}`,
  )

  urlParams.append('signature', signedRequest)

  const signedUrl = `${url}?${urlParams.toString()}`

  const signedHeader: IBinanceSignedHeaders = {
    'X-MBX-APIKEY': key,
  }

  return {
    signedUrl,
    signedHeader,
  }

}
