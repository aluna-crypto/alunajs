import { IAlunaHttp } from '../core/IAlunaHttp'



export interface IAlunaModuleParams {
  http?: IAlunaHttp
}

export interface IAlunaModuleReturns {
  requestCount: number
}
