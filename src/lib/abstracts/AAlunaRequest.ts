import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'



export abstract class AAlunaRequest {

  public readonly keySecret?: IAlunaKeySecretSchema



  constructor (
    params?: {
      keySecret: IAlunaKeySecretSchema
    }
  ) {

    this.keySecret = params?.keySecret

  }

}
