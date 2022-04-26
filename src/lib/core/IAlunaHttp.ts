import { AlunaHttpVerbEnum } from '../enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export interface IAlunaHttpOptions {
  headers?: any
  httpsAgent?: any
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

export interface IAlunaHttpResponse<T> {
  data: T
  requestCount: IAlunaHttpRequestCount
}

export interface IAlunaHttp {
  requestCount: IAlunaHttpRequestCount
  publicRequest<T>(params: IAlunaHttpPublicParams): Promise<IAlunaHttpResponse<T>> // eslint-disable-line
  authedRequest<T>(params: IAlunaHttpAuthedParams): Promise<IAlunaHttpResponse<T>> // eslint-disable-line
}
