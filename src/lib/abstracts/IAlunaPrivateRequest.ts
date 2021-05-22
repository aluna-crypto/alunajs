import {
  IAlunaRequestOptions,
} from './IAlunaPublicRequest'



export interface IAlunaPrivateRequestParams {
  url: string
  body?: any
  options?: IAlunaRequestOptions
}

export interface IAlunaPrivateRequest {
  post<T>(params: IAlunaPrivateRequestParams): Promise<T>
  get<T>(params: IAlunaPrivateRequestParams): Promise<T>
}
