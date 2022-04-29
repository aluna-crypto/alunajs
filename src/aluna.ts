import { Bittrex } from './exchanges/bittrex/Bittrex'
import { bittrexBaseSpecs } from './exchanges/bittrex/bittrexSpecs'
import { AlunaError } from './lib/core/AlunaError'
import { IAlunaExchangePublic } from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



export function aluna(
  exchangeId: string,
  settings: IAlunaSettingsSchema = {},
): IAlunaExchangePublic {

  switch (exchangeId) {

    case bittrexBaseSpecs.id:
      return new Bittrex({ settings })

    default: {

      throw new AlunaError({
        httpStatusCode: 200,
        message: `Exchange not supported: ${exchangeId}.`,
        code: AlunaExchangeErrorCodes.NOT_SUPPORTED,
      })

    }

  }

}
