import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/enums/errors/AlunaExchangeErrorCodesEnum'
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

      case this.Valr.ID:
        return new this.Valr(subParams)

      default: {

        const error = new AlunaError({
          errorMsg: `Exchange not supported: ${exchangeId}`,
          errorCode: AlunaExchangeErrorCodes.EXCHANGE_NOT_SUPPORTED,
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

      case this.Valr.ID:
        return this.Valr

      default: {

        const error = new AlunaError({
          errorMsg: `Exchange not supported: ${exchangeId}`,
          errorCode: AlunaExchangeErrorCodes.EXCHANGE_NOT_SUPPORTED,
        })

        Log.error(error)

        throw error

      }

    }

  }

}
