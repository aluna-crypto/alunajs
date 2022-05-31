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
import { handleHuobiRequestError } from './errors/handleHuobiRequestError'



export const HUOBI_HTTP_CACHE_KEY_PREFIX = 'HuobiHttp.publicRequest'



export class HuobiHttp implements IAlunaHttp {

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
      prefix: HUOBI_HTTP_CACHE_KEY_PREFIX,
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

      const { data: { data } } = await axios
        .create()
        .request<IHuobiHttpResponse<T>>(requestConfig)

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, data, cacheTtlInSeconds)
      }

      return data

    } catch (error) {

      throw handleHuobiRequestError({ error })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      url: rawUrl,
      body,
      verb = AlunaHttpVerbEnum.POST,
      credentials,
      query,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const { queryParamsWithSignature } = generateAuthHeader({
      verb,
      credentials,
      body,
      url: rawUrl,
      query,
    })

    const { proxySettings } = settings

    const url = `${rawUrl}?${queryParamsWithSignature.toString()}`

    const headers = {
      'Content-Type': 'application/json',
    }

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers,
      proxySettings,
    })

    this.requestWeight.authed += weight

    try {

      const { data: request } = await axios
        .create()
        .request<IHuobiHttpResponse<T>>(requestConfig)

      if (request.status === 'error') {

        throw request

      }

      const { data } = request

      return data

    } catch (error) {

      throw handleHuobiRequestError({ error })

    }

  }

}



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  credentials: IAlunaCredentialsSchema
  url: string
  query?: string | undefined
  body?: any
}

export interface IHuobiSignedHeaders {
  queryParamsWithSignature: URLSearchParams
}

export interface IHuobiHttpResponse<T> {
  data: T
  ts: number
  status: string
  'err-code'?: string
  'err-msg'?: string
}



export const generateAuthHeader = (
  params: ISignedHashParams,
): IHuobiSignedHeaders => {

  const {
    credentials,
    verb,
    url,
    query,
  } = params

  const {
    key,
    secret,
  } = credentials

  const timestamp = new Date().toISOString().slice(0, -5)

  const queryParams = new URLSearchParams()

  queryParams.append('AccessKeyId', key)
  queryParams.append('SignatureMethod', 'HmacSHA256')
  queryParams.append('SignatureVersion', '2')
  queryParams.append('Timestamp', timestamp.toString())

  const includeSearchQuery = query
    ? new URLSearchParams(`${queryParams.toString()}&${query}`)
    : queryParams

  const path = new URL(url).pathname
  const baseURL = new URL(url).host

  const queryString = includeSearchQuery.toString()

  const meta = [verb.toUpperCase(), baseURL, path, queryString].join('\n')

  const signedRequest = crypto
    .createHmac('sha256', secret)
    .update(meta)
    .digest('base64')

  includeSearchQuery.append('Signature', signedRequest)

  return {
    queryParamsWithSignature: includeSearchQuery,
  }

}
