import { IAlunaKeySecretSchema } from '../../schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from '../../schemas/IAlunaSettingsSchema'



export abstract class AAlunaExchange {

  public keySecret: IAlunaKeySecretSchema

  public static settings: IAlunaSettingsSchema

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    this.keySecret = params.keySecret

  }

  public static setSettings (params: {
    settings?: IAlunaSettingsSchema,
  }) {

    const { settings } = params

    const defaultSettings: IAlunaSettingsSchema = {
      mappings: {},
    }

    this.settings = settings || defaultSettings

  }

}
