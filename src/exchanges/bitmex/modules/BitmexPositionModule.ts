import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaOrderErrorCodes } from '../../../lib/errors/AlunaOrderErrorCodes'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetParams,
  IAlunaPositionModule,
  IAlunaPositionSetLeverageParams,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { IBitmexPositionSchema } from '../schemas/IBitmexPositionSchema'
import { BitmexPositionParser } from '../schemas/parsers/BitmexPositionParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexPositionModule extends AAlunaModule implements Required<IAlunaPositionModule> {

  async list (): Promise<any[]> {

    const rawPositions = await this.listRaw()

    const parsedPositions = this.parseMany({ rawPositions })

    return parsedPositions

  }

  async listRaw (): Promise<any[]> {

    const { privateRequest } = BitmexHttp

    const rawPositions = await privateRequest<any[]>({
      url: `${PROD_BITMEX_URL}/position`,
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
      body: { filter: { isOpen: true } },
    })

    return rawPositions

  }

  async get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema> {

    const rawPosition = await this.getRaw(params)

    const parsedPosition = await this.parse({ rawPosition })

    return parsedPosition

  }

  async getRaw (
    params: IAlunaPositionGetParams,
  ): Promise<IBitmexPositionSchema> {

    const {
      symbolPair,
    } = params

    if (!symbolPair) {

      const error = new AlunaError({
        code: AlunaOrderErrorCodes.MISSING_PARAMS,
        message: 'Position symbol is required to close Bitmex positions',
        httpStatusCode: 400,
      })

      BitmexLog.error(error)

      throw error

    }

    const { privateRequest } = BitmexHttp

    const [rawPosition] = await privateRequest<Array<IBitmexPositionSchema>>({
      url: `${PROD_BITMEX_URL}/position`,
      body: { filter: { symbol: symbolPair } },
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
    })

    return rawPosition

  }

  async close (
    params: IAlunaPositionCloseParams,
  ): Promise<IAlunaPositionSchema> {

    const { symbolPair } = params

    if (!symbolPair) {

      const error = new AlunaError({
        code: AlunaOrderErrorCodes.MISSING_PARAMS,
        message: 'Position symbol is required to close Bitmex positions',
        httpStatusCode: 400,
      })

      BitmexLog.error(error)

      throw error

    }

    const { privateRequest } = BitmexHttp

    await privateRequest<IBitmexOrderSchema>({
      url: `${PROD_BITMEX_URL}/order`,
      body: { execInst: 'Close', symbol: symbolPair },
      keySecret: this.exchange.keySecret,
    })

    const parsedPosition = await this.get({
      symbolPair,
    })

    return parsedPosition

  }

  async parse (params: {
    rawPosition: IBitmexPositionSchema,
  }): Promise<IAlunaPositionSchema> {

    const { rawPosition } = params

    const { symbol } = rawPosition

    const parsedMarket = await BitmexMarketModule.get({
      symbolPair: symbol,
    })

    if (!parsedMarket) {

      const alunaError = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: `Bitmex symbol pair not found for ${symbol}`,
        httpStatusCode: 400,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

    const {
      baseSymbolId,
      quoteSymbolId,
      instrument,
    } = parsedMarket

    const parsedPosition = BitmexPositionParser.parse({
      rawPosition,
      baseSymbolId,
      quoteSymbolId,
      instrument: instrument!,
    })

    return parsedPosition

  }

  async parseMany (params: {
    rawPositions: any[],
  }): Promise<IAlunaPositionSchema[]> {

    const { rawPositions } = params

    const promises = map(rawPositions, async (rawPosition) => {

      const parsedPosition = await this.parse({
        rawPosition,
      })

      return parsedPosition

    })

    const parsedPositions = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedPositions.length} for Bitmex`)

    return parsedPositions

  }

  async getLeverage (
    params: IAlunaPositionGetLeverageParams,
  ): Promise<number> {

    const { symbolPair } = params

    const {
      leverage,
      crossMargin,
    } = await this.getRaw({ symbolPair })

    const computedLeverage = crossMargin
      ? 0
      : leverage

    return computedLeverage

  }

  async setLeverage (
    params: IAlunaPositionSetLeverageParams,
  ): Promise<number> {

    const {
      leverage,
      symbolPair,
    } = params

    const { privateRequest } = BitmexHttp

    const {
      leverage: settedLeverage,
    } = await privateRequest<IBitmexPositionSchema>({
      url: `${PROD_BITMEX_URL}/position/leverage`,
      body: { symbol: symbolPair, leverage },
      keySecret: this.exchange.keySecret,
    })

    return settedLeverage

  }

}
