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
import { handleHuobiRequestError } from './errors/handleHuobiRequestError'
import { Huobi } from './Huobi'



export const HUOBI_HTTP_CACHE_KEY_PREFIX = 'HuobiHttp.publicRequest'



interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  keySecret: IAlunaKeySecretSchema
  body?: any
  query: string | undefined
  url: string
}



export interface IHuobiSignedSignature {
  queryParamsWithSignature: URLSearchParams
}

export interface IHuobiHttpResponse<T> {
  data: T
  ts: number
  status: string
  'err-code'?: string
  'err-msg'?: string
}



export const generateAuthSignature = (
  params: ISignedHashParams,
): IHuobiSignedSignature => {

  const {
    keySecret,
    verb,
    url,
    query,
  } = params


  const timestamp = new Date().toISOString().slice(0, -5)

  const queryParams = new URLSearchParams()

  queryParams.append('AccessKeyId', keySecret.key)
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
    .createHmac('sha256', keySecret.secret)
    .update(meta)
    .digest('base64')

  includeSearchQuery.append('Signature', signedRequest)

  return {
    queryParamsWithSignature: includeSearchQuery,
  }

}


export const HuobiHttp: IAlunaHttp = class {

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
      prefix: HUOBI_HTTP_CACHE_KEY_PREFIX,
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
      proxySettings: Huobi.settings.proxySettings,
    })

    try {

      const { data: { data } } = await axios
        .create()
        .request<IHuobiHttpResponse<T>>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleHuobiRequestError({ error })

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

    const { queryParamsWithSignature } = generateAuthSignature({
      verb,
      keySecret,
      body,
      url,
      query,
    })

    const fullUrl = `${url}?${queryParamsWithSignature.toString()}`

    const assembleAxiosRequestConfigObject = {
      url: fullUrl,
      method: verb,
      proxySettings: Huobi.settings.proxySettings,
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const {
      requestConfig,
    } = assembleAxiosRequestConfig(assembleAxiosRequestConfigObject)

    try {

      const { data: req } = await axios
        .create()
        .request<IHuobiHttpResponse<T>>(
          requestConfig,
        )

      if (req['err-msg']) {

        const error = new Error(req['err-msg'])

        error.name = req['err-code']!

        throw handleHuobiRequestError({ error })

      }

      const { data } = req

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleHuobiRequestError({ error })

    }

  }

}
