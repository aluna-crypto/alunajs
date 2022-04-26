import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../core/IAlunaHttp'



export interface IAlunaModuleParams {
  http?: IAlunaHttp
}

export interface IAlunaModuleReturns {
  requestCount: IAlunaHttpRequestCount
}
