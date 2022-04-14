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
  query: URLSearchParams
  url: string
}



export interface IHuobiSignedSignature {
  signature: string
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

  const path = new URL(url).pathname
  const baseURL = new URL(url).host

  const queryString = query.toString()

  const meta = [verb.toUpperCase(), baseURL, path, queryString].join('\n')

  const signedRequest = crypto
    .createHmac('sha256', keySecret.secret)
    .update(meta)
    .digest('base64')

  return {
    signature: signedRequest,
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

      const { data } = await axios.create().request<T>(requestConfig)

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
    } = params

    const timestamp = new Date().toISOString().slice(0, -5)

    const queryParams = new URLSearchParams()

    queryParams.append('AccessKeyId', keySecret.key)
    queryParams.append('SignatureMethod', 'HmacSHA256')
    queryParams.append('SignatureVersion', '2')
    queryParams.append('Timestamp', timestamp.toString())

    const signedHash = generateAuthSignature({
      verb,
      keySecret,
      body,
      url,
      query: queryParams,
    })

    queryParams.append('Signature', signedHash.signature)

    const fullUrl = `${url}?${queryParams.toString()}`

    const { requestConfig } = assembleAxiosRequestConfig({
      url: fullUrl,
      method: verb,
      proxySettings: Huobi.settings.proxySettings,
    })

    try {

      const { data } = await axios.create().request<T>(
        requestConfig,
      )

      return {
        data,
        requestCount: 1,
      }

    } catch (error) {

      throw handleHuobiRequestError({ error })

    }

  }

}
