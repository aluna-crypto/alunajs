import { AlunaHttpVerbEnum } from '../enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export interface IAlunaHttpOptions {
  headers?: any
  httpsAgent?: any // TODO: Should it be IAlunaProxySchema?
}

export interface IAlunaHttpPublicParams {
  url: string
  verb?: AlunaHttpVerbEnum
  body?: Record<string, any>
  options?: IAlunaHttpOptions
  settings?: IAlunaSettingsSchema
  query?: string
  weight?: number
}

export interface IAlunaHttpAuthedParams extends IAlunaHttpPublicParams {
  credentials: IAlunaCredentialsSchema
}

export interface IAlunaHttpRequestCount {
  authed: number
  public: number
}

export interface IAlunaHttp {
  requestWeight: IAlunaHttpRequestCount
  publicRequest<T>(params: IAlunaHttpPublicParams): Promise<T>
  authedRequest<T>(params: IAlunaHttpAuthedParams): Promise<T>
}
