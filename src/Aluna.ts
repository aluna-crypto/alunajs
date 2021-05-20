import { Exchanges } from '../src/lib/Exchanges'
import { IAlunaExchange } from './lib/abstracts/IAlunaExchange'
import { IAlunaKeySecretSchema } from './lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



export class Aluna extends Exchanges {



  static readonly exchanges = Exchanges



  static static (params: { exchangeId: string }) {

    const { exchangeId } = params

    switch (exchangeId) {
      case this.Valr.ID:
        return this.Valr
      default:
        throw new Error(`Exchange not implemented: ${exchangeId}`)

    }

  }



  static new (
    params: {
      exchangeId: string
      keySecret: IAlunaKeySecretSchema
      settings?: IAlunaSettingsSchema
    }
  ): IAlunaExchange {

    const {
      exchangeId,
      keySecret,
      settings,
    } = params

    switch (exchangeId) {
      case this.Valr.ID:
        return new this.Valr({ keySecret, settings })
      default:
        throw new Error(`Exchange not implemented: ${exchangeId}`)

    }

  }

}
