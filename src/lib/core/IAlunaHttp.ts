import { AlunaHttpVerbEnum } from '../enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
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
}

export interface IAlunaHttpPrivateParams extends IAlunaHttpPublicParams {
  keySecret: IAlunaKeySecretSchema
}

export interface IAlunaHttpResponseWithRequestCount<T> {
  data: T
  apiRequestCount: number
}

export interface IAlunaHttp {
  publicRequest<T>(params: IAlunaHttpPublicParams)
    : Promise<IAlunaHttpResponseWithRequestCount<T>>
  privateRequest<T>(params: IAlunaHttpPrivateParams)
    : Promise<IAlunaHttpResponseWithRequestCount<T>>
}
