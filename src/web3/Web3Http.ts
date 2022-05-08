import axios from 'axios'
import { debug } from 'debug'

import { AlunaError } from '../lib/core/AlunaError'
import {
  IAlunaHttp,
  IAlunaHttpAuthedParams,
  IAlunaHttpPublicParams,
  IAlunaHttpRequestCount,
} from '../lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../lib/enums/AlunaHtttpVerbEnum'
import { AlunaExchangeErrorCodes } from '../lib/errors/AlunaExchangeErrorCodes'
import { AlunaHttpErrorCodes } from '../lib/errors/AlunaHttpErrorCodes'
import { IAlunaSettingsSchema } from '../lib/schemas/IAlunaSettingsSchema'
import { assembleRequestConfig } from '../utils/axios/assembleRequestConfig'
import { AlunaCache } from '../utils/cache/AlunaCache'



const log = debug('@alunajs:web3/http')



export const WEB3_CACHE_KEY_PREFIX = 'Web3.publicRequest'



export class Web3Http implements IAlunaHttp {

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

    log('performing public request')

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
      settings,
    } = params

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

    this.requestCount.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      AlunaCache.cache.set<T>(cacheKey, data)

      return data

    } catch (error) {

      throw new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: 'Error requesting Web3 data.',
        metadata: error,
      })

    }

  }



  public async authedRequest <T>(
    params: IAlunaHttpAuthedParams,
  ): Promise<T> {

    log('performing authed request')

    throw new AlunaError({
      code: AlunaExchangeErrorCodes.METHOD_NOT_IMPLEMENTED,
      message: 'Authed requests are not implemented yet.',
      metadata: { params },
    })

  }

}
