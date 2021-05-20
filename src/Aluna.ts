import { Exchanges } from '../src/lib/exchanges'
import { IAlunaExchange } from './lib/requests/IAlunaExchange'
import { IAlunaKeySecretSchema } from './lib/schemas/IAlunaKeySecretSchema'
import { IAlunaOptionsSchema } from './lib/schemas/IAlunaSettingsSchema'



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
      options?: IAlunaOptionsSchema
    }
  ): IAlunaExchange {

    const {
      exchangeId,
      keySecret,
      options,
    } = params

    switch (exchangeId) {
      case this.Valr.ID:
        return new this.Valr({ keySecret, options })
      default:
        throw new Error(`Exchange not implemented: ${exchangeId}`)

    }

  }

}
