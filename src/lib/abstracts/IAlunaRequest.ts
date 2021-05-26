import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'



export interface IAlunaRequestOptions {
  // ...
}

export interface IAlunaRequestParams {
  url: string
  body?: any
  credentials: IAlunaKeySecretSchema
  options?: IAlunaRequestOptions
}

export interface IAlunaRequest {
  post<T>(params: IAlunaRequestParams): Promise<T>
  get<T>(params: IAlunaRequestParams): Promise<T>
}
