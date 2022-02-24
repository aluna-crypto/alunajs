import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaPositionStatusEnum } from '../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionGetParams,
  IAlunaPositionModule,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { PoloniexHttp } from '../PoloniexHttp'
import { PoloniexLog } from '../PoloniexLog'
import { PROD_POLONIEX_URL } from '../PoloniexSpecs'
import {
  IPoloniexPositionInfo,
  IPoloniexPositionSchema,
  IPoloniexPositionWithCurrency,
} from '../schemas/IPoloniexPositionSchema'
import { PoloniexCurrencyParser } from '../schemas/parsers/PoloniexCurrencyParser'
import { PoloniexPositionParser } from '../schemas/parsers/PoloniexPositionParser'



export class PoloniexPositionModule extends AAlunaModule implements IAlunaPositionModule {

  async list (): Promise<IAlunaPositionSchema[]> {

    const rawPositions = await this.listRaw()

    const parsedPositions = this.parseMany({ rawPositions })

    return parsedPositions

  }

  async listRaw (): Promise<IPoloniexPositionWithCurrency[]> {

    const { privateRequest } = PoloniexHttp

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'getMarginPosition')
    body.append('currencyPair', 'all')
    body.append('nonce', timestamp.toString())

    const rawPositions = await privateRequest<IPoloniexPositionSchema>({
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      body,
      keySecret: this.exchange.keySecret,
    })

    const rawPositionsWithCurrency = PoloniexCurrencyParser
      .parse<IPoloniexPositionWithCurrency>({
        rawInfo: rawPositions,
      })

    return rawPositionsWithCurrency

  }

  async get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema> {

    const rawPosition = await this.getRaw(params)

    const parsedPosition = this.parse({ rawPosition })

    return parsedPosition

  }

  async getRaw (
    params: IAlunaPositionGetParams,
  ): Promise<IPoloniexPositionWithCurrency> {

    const { id } = params

    const { privateRequest } = PoloniexHttp

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'getMarginPosition')
    body.append('currencyPair', id)
    body.append('nonce', timestamp.toString())

    const rawPosition = await privateRequest<IPoloniexPositionInfo>({
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      body,
      keySecret: this.exchange.keySecret,
    })

    const splittedSymbolPair = id.split('_')
    const baseCurrency = splittedSymbolPair[0]
    const quoteCurrency = splittedSymbolPair[1]

    const rawPositionWithCurrency: IPoloniexPositionWithCurrency = {
      ...rawPosition,
      baseCurrency,
      currencyPair: id,
      quoteCurrency,
    }

    return rawPositionWithCurrency

  }

  async close (
    params: IAlunaPositionCloseParams,
  ): Promise<IAlunaPositionSchema> {

    const { id } = params

    if (!id) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.DOESNT_HAVE_ID,
        message: 'Position id is required to close Poloniex positions',
        httpStatusCode: 400,
      })

      PoloniexLog.error(error)

      throw error

    }

    const parsedPosition = await this.get({ id })

    const { privateRequest } = PoloniexHttp

    const timestamp = new Date().getTime()
    const body = new URLSearchParams()

    body.append('command', 'closeMarginPosition')
    body.append('currencyPair', id)
    body.append('nonce', timestamp.toString())

    await privateRequest<void>({
      url: `${PROD_POLONIEX_URL}/tradingApi`,
      body,
      keySecret: this.exchange.keySecret,
    })

    parsedPosition.status = AlunaPositionStatusEnum.CLOSED

    return parsedPosition

  }

  parse (params: {
    rawPosition: IPoloniexPositionWithCurrency,
  }): IAlunaPositionSchema {

    const { rawPosition } = params

    const parsedPosition = PoloniexPositionParser.parse({
      rawPosition,
    })

    return parsedPosition

  }

  parseMany (params: {
    rawPositions: IPoloniexPositionWithCurrency[],
  }): IAlunaPositionSchema[] {

    const { rawPositions } = params

    const parsedPositions = rawPositions.reduce((acc, rawPosition) => {

      const parsedPosition = this.parse({ rawPosition })

      acc.push(parsedPosition)

      return acc

    }, [] as IAlunaPositionSchema[])

    return parsedPositions

  }

}
