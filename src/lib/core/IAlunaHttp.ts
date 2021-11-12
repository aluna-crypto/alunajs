import { AlunaHttpVerbEnum } from '../enums/AlunaHtttpVerbEnum'
import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export interface IAlunaHttpOptions {
  headers?: any
  httpsAgent?: any
}



export interface IAlunaHttpPublicParams {
  url: string
  queryString?: string
  verb?: AlunaHttpVerbEnum
  body?: Record<string, any>
  options?: IAlunaHttpOptions
  settings?: IAlunaSettingsSchema
}

export interface IAlunaHttpPrivateParams extends IAlunaHttpPublicParams {
  keySecret: IAlunaKeySecretSchema
}


export interface IAlunaHttp {
  publicRequest<T>(params: IAlunaHttpPublicParams): Promise<T>
  privateRequest<T>(params: IAlunaHttpPrivateParams): Promise<T>
}
