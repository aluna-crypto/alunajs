import { IAlunaKeySecretSchema } from '../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../schemas/IAlunaSettingsSchema'



export abstract class AAlunaExchange {

  public keySecret: IAlunaKeySecretSchema
  public settings?: IAlunaSettingsSchema

  constructor (
    params: {
      keySecret: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    }
  ) {
    this.keySecret = params.keySecret
    this.settings = params.settings
  }

}
