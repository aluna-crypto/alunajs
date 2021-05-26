import { IAlunaKeySecretSchema } from '@lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '@lib/schemas/IAlunaSettingsSchema'



export abstract class AAlunaRequest {

  public readonly keySecret?: IAlunaKeySecretSchema
  public readonly settings?: IAlunaSettingsSchema



  constructor (
    params?: {
      keySecret?: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    }
  ) {

    this.keySecret = params?.keySecret
    this.settings = params?.settings

  }

}
