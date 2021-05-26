import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'



export interface IAlunaRequestOptions {
  headers?: any
  httpsAgent?: any
}

export interface IAlunaRequestParams {
  url: string
  body?: any
  options?: IAlunaRequestOptions
  keySecret?: IAlunaKeySecretSchema
  settings?: IAlunaSettingsSchema
}

export interface IAlunaRequest {
  post<T>(params: IAlunaRequestParams): Promise<T>
  get<T>(params: IAlunaRequestParams): Promise<T>
}
