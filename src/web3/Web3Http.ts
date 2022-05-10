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

    log('performing public request')

    const {
      url,
      body,
      verb = AlunaHttpVerbEnum.GET,
      weight = 1,
    } = params

    const settings = (params.settings || this.settings)

    const {
      cacheTtlInSeconds = 60,
      disableCache = false,
    } = settings

    const { proxySettings } = settings

    const { requestConfig } = assembleRequestConfig({
      url,
      method: verb,
      data: body,
      proxySettings,
    })

    const cacheKey = AlunaCache.hashCacheKey({
      args: params,
      prefix: WEB3_CACHE_KEY_PREFIX,
    })

    if (!disableCache && AlunaCache.cache.has(cacheKey)) {
      return AlunaCache.cache.get<T>(cacheKey) as T
    }

    this.requestWeight.public += weight

    try {

      const { data } = await axios.create().request<T>(requestConfig)

      if (!disableCache) {
        AlunaCache.cache.set<T>(cacheKey, data, cacheTtlInSeconds)
      }

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
