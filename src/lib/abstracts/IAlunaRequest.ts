import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'



export interface IAlunaRequestOptions {
  headers?: any
  httpsAgent?: any
}

export interface IAlunaRequestPublicParams {
  url: string
  body?: any
  options?: IAlunaRequestOptions
  keySecret?: IAlunaKeySecretSchema // optional
  settings?: IAlunaSettingsSchema
}

export interface IAlunaRequestPrivateParams extends IAlunaRequestPublicParams {
  keySecret: IAlunaKeySecretSchema // required
}


export interface IAlunaRequest {

  // public methods (if `keySecret` is passed, make it private)
  post<T>(params: IAlunaRequestPublicParams): Promise<T>
  get<T>(params: IAlunaRequestPublicParams): Promise<T>

  // public methods (doesn't require `keySecret`)
  publicPost<T>(params: IAlunaRequestPublicParams): Promise<T>
  publicPet<T>(params: IAlunaRequestPublicParams): Promise<T>

  // private methods (requires `keySecret`)
  privatePost<T>(params: IAlunaRequestPrivateParams): Promise<T>
  privateGet<T>(params: IAlunaRequestPrivateParams): Promise<T>

}
