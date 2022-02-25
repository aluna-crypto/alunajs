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

    const subParams = {
      keySecret,
      settings,
    }

    switch (exchangeId) {

      case this.Binance.ID:
        return new this.Binance(subParams)

      case this.Gateio.ID:
        return new this.Gateio(subParams)

      case this.Bitfinex.ID:
        return new this.Bitfinex(subParams)

      case this.Bitmex.ID:
        return new this.Bitmex(subParams)

      case this.Bittrex.ID:
        return new this.Bittrex(subParams)

      case this.Valr.ID:
        return new this.Valr(subParams)

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

  }

  static static (
    params: {
      exchangeId: string,
    },
  ): IAlunaExchangeStatic {

    const {
      exchangeId,
    } = params

    switch (exchangeId) {

      case this.Binance.ID:
        return this.Binance

      case this.Gateio.ID:
        return this.Gateio

      case this.Bitfinex.ID:
        return this.Bitfinex

      case this.Bitmex.ID:
        return this.Bitmex

      case this.Bittrex.ID:
        return this.Bittrex

      case this.Valr.ID:
        return this.Valr

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

  }

}
