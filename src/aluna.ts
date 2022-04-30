import { AlunaError } from './lib/core/AlunaError'
import { IAlunaExchangeAuthed, IAlunaExchangePublic } from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { exchanges } from './lib/exchanges'
import { IAlunaCredentialsSchema } from './lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



type TPublicParmas = {
  settings?: IAlunaSettingsSchema
}

type TAuthedParams = {
  settings?: IAlunaSettingsSchema
  credentials: IAlunaCredentialsSchema
}



export function aluna <T extends TPublicParmas | TAuthedParams>(
  exchangeId: string,
  params?: T,
): T extends TAuthedParams ? IAlunaExchangeAuthed : IAlunaExchangePublic {

  const exchange = exchanges[exchangeId]

  if (!exchange) {
    throw new AlunaError({
      httpStatusCode: 200,
      message: `Exchange not supported: ${exchangeId}.`,
      code: AlunaExchangeErrorCodes.NOT_SUPPORTED,
    })
  }

  const {
    settings,
    credentials,
  } = (params || {}) as any

  let instance: IAlunaExchangeAuthed | IAlunaExchangePublic

  if (credentials) {
    instance = new exchange.Authed({ settings, credentials })
  } else {
    instance = new exchange.Public({ settings })
  }

  const output = <T extends TAuthedParams
    ? IAlunaExchangeAuthed
    : IAlunaExchangePublic
  > instance

  return output

}
