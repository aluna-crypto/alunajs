import { IAlunaExchange } from './lib/abstracts/IAlunaExchange'
import { Exchanges } from './lib/Exchanges'
import { Log } from './lib/Log'
import { IAlunaKeySecretSchema } from './lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



export class Aluna extends Exchanges {

  static readonly exchanges = Exchanges



  static new (
    params: {
      exchangeId: string,
      keySecret: IAlunaKeySecretSchema,
      settings?: IAlunaSettingsSchema,
    },
  ): IAlunaExchange {

    const {
      exchangeId,
      keySecret,
      settings,
    } = params

    Log.info(JSON.stringify({
      exchangeId,
      settings,
    }, null, 0))

    const subParams = {
      keySecret,
      settings,
    }

    switch (exchangeId) {

      case 'valr':
        return new Exchanges.Valr(subParams)

      default:
        throw new Error(`Exchange not implemented: ${exchangeId}`)

    }

  }

}

