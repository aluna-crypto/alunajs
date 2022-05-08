import axios from 'axios'

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
import { handleSampleRequestError } from './errors/handleSampleRequestError'



export const SAMPLE_HTTP_CACHE_KEY_PREFIX = 'SampleHttp.publicRequest'



export class SampleHttp implements IAlunaHttp {

  public settings: IAlunaSettingsSchema
  public requestCount: IAlunaHttpRequestCount



  constructor(settings: IAlunaSettingsSchema) {

    this.requestCount = {
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
      settings,
    } = params

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: SAMPLE_HTTP_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return AlunaCache.cache.get<T>(cacheKey) as T

    }

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings: settings?.proxySettings,
    })

    this.requestCount.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return data

    } catch (error) {

      throw handleSampleRequestError({ error })

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
      settings,
      weight = 1,
    } = params

    const signedHash = generateAuthHeader({
      verb,
      path: new URL(url).pathname,
      credentials,
      body,
      url,
    })

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      headers: signedHash, // TODO: Review headers injection
      proxySettings: settings?.proxySettings,
    })

    this.requestCount.authed += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      return data

    } catch (error) {

      throw handleSampleRequestError({ error })

    }

  }

}



// FIXME: Review interface properties
interface ISignedHashParams {
  verb: AlunaHttpVerbEnum
  path: string
  credentials: IAlunaCredentialsSchema
  url: string
  body?: any
}

// FIXME: Review interface properties
export interface ISampleSignedHeaders {
  'Api-Timestamp': number
}



export const generateAuthHeader = (
  _params: ISignedHashParams,
): ISampleSignedHeaders => {

  // FIXME: Implement method (and rename `_params` to `params`)

  // const {
  //   credentials,
  //   verb,
  //   body,
  //   url,
  // } = params

  // const {
  //   key,
  //   secret,
  // } = credentials

  const timestamp = Date.now()

  return {
    'Api-Timestamp': timestamp,
  }

}
