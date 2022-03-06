import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
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

    let Exchange: IAlunaExchangeStatic

    switch (exchangeId) {

      case this.Binance.ID:
        Exchange = this.Binance
        break

      case this.Gateio.ID:
        Exchange = this.Gateio
        break

      case this.Bitfinex.ID:
        Exchange = this.Bitfinex
        break

      case this.Bitmex.ID:
        Exchange = this.Bitmex
        break

      case this.Bittrex.ID:
        Exchange = this.Bittrex
        break

      case this.Valr.ID:
        Exchange = this.Valr
        break

      case this.Poloniex.ID:
        Exchange = this.Poloniex
        break

      default: {

        const error = new AlunaError({
          message: `Exchange not supported: ${exchangeId}`,
          code: AlunaExchangeErrorCodes.NOT_SUPPORTED,
          httpStatusCode: 200,
        })

        Log.error(error)

        throw error

      }

    }

    if (settings) {

      Exchange.setSettings({ settings })

    }

    return new Exchange({ keySecret })

  }

  static static (
    params: {
      exchangeId: string,
      settings?: IAlunaSettingsSchema,
    },
  ): IAlunaExchangeStatic {

    const {
      exchangeId,
      settings,
    } = params

    let Exchange: IAlunaExchangeStatic

    switch (exchangeId) {

      case this.Binance.ID:
        Exchange = this.Binance
        break

      case this.Gateio.ID:
        Exchange = this.Gateio
        break

      case this.Bitfinex.ID:
        Exchange = this.Bitfinex
        break

      case this.Bitmex.ID:
        Exchange = this.Bitmex
        break

      case this.Bittrex.ID:
        Exchange = this.Bittrex
        break

      case this.Valr.ID:
        Exchange = this.Valr
        break

      case this.Poloniex.ID:
        Exchange = this.Poloniex
        break

      default: {

        const error = new AlunaError({
          message: `Exchange not supported: ${exchangeId}`,
          code: AlunaExchangeErrorCodes.NOT_SUPPORTED,
          httpStatusCode: 200,
        })

        Log.error(error)

        throw error

      }

    }

    if (settings) {

      Exchange.setSettings({ settings })

    }

    return Exchange

  }

}
