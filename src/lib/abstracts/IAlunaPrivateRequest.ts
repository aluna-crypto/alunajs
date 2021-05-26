import { IAlunaKeySecretSchema } from 'lib/schemas/IAlunaKeySecretSchema'

import { IAlunaRequestOptions } from './IAlunaPublicRequest'



export interface IAlunaPrivateRequestParams {
  url: string
  credentials: IAlunaKeySecretSchema
  body?: any
  options?: IAlunaRequestOptions
}

export interface IAlunaPrivateRequest {
  post<T>(params: IAlunaPrivateRequestParams): Promise<T>
  get<T>(params: IAlunaPrivateRequestParams): Promise<T>
}
