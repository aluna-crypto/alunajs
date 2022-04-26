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

export interface IAlunaHttpPrivateParams extends IAlunaHttpPublicParams {
  credentials: IAlunaCredentialsSchema
}

export interface IAlunaHttpResponse<T> {
  data: T
  requestCount: number
}

export interface IAlunaHttp {

  requestCount: {
    authed: number,
    public: number,
  }

  publicRequest<T>(params: IAlunaHttpPublicParams): Promise<IAlunaHttpResponse<T>> // eslint-disable-line
  privateRequest<T>(params: IAlunaHttpPrivateParams): Promise<IAlunaHttpResponse<T>> // eslint-disable-line

}
