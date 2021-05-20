export interface IAlunaRequestOptions {
  headers: any
  httpsAgent: any
}

export interface IAlunaPublicRequestParams {
  url: string
  body?: any
  options?: IAlunaRequestOptions
}

export interface IAlunaPublicRequest {
  get<T>(params: IAlunaPublicRequestParams): Promise<T>
  post<T>(params: IAlunaPublicRequestParams): Promise<T>
}
