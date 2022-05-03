import axios, { AxiosError } from 'axios'
import { debug } from 'debug'

import { AlunaError } from '../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../lib/enums/AlunaHtttpVerbEnum'
import { AlunaHttpErrorCodes } from '../lib/errors/AlunaHttpErrorCodes'
import { assembleRequestConfig } from '../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../utils/cache/AlunaCache'



const log = debug('@alunajs:web3/http')



export const WEB3_CACHE_KEY_PREFIX = 'Web3.publicRequest'



export class Web3Http implements IAlunaHttp {

  public requestCount: IAlunaHttpRequestCount



  constructor() {

    this.requestCount = {
      authed: 0,
      public: 0,
    }

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

    this.requestCount.public += weight

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings: settings?.proxySettings,
    })

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: WEB3_CACHE_KEY_PREFIX,
    })

    if (AlunaCache.cache.has(cacheKey)) {

      return AlunaCache.cache.get<T>(cacheKey) as T

    }

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return data

    } catch (error) {

      const { response } = error as AxiosError
      const defaultMessage = 'Error requesting Web3 data.'

      throw new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: response?.data?.code || defaultMessage,
        metadata: error,
      })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    const {
      weight = 1,
    } = params

    log('TODO: Implement stub method: Web3.authedRequest')

    this.requestCount.authed += weight

    const data: T = params as any

    return data

  }

}
