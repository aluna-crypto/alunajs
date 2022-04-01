import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaBalanceErrorCodes } from '../../../lib/errors/AlunaBalanceErrorCodes'
import { AlunaGenericErrorCodes } from '../../../lib/errors/AlunaGenericErrorCodes'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionCloseReturns,
  IAlunaPositionGetLeverageParams,
  IAlunaPositionGetLeverageReturns,
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
  IAlunaPositionGetReturns,
  IAlunaPositionListRawReturns,
  IAlunaPositionListReturns,
  IAlunaPositionModule,
  IAlunaPositionParseManyReturns,
  IAlunaPositionParseReturns,
  IAlunaPositionSetLeverageParams,
  IAlunaPositionSetLeverageReturns,
} from '../../../lib/modules/IAlunaPositionModule'
import { BitmexHttp } from '../BitmexHttp'
import { BitmexLog } from '../BitmexLog'
import { PROD_BITMEX_URL } from '../BitmexSpecs'
import { IBitmexOrderSchema } from '../schemas/IBitmexOrderSchema'
import { IBitmexPositionSchema } from '../schemas/IBitmexPositionSchema'
import { BitmexPositionParser } from '../schemas/parsers/BitmexPositionParser'
import { BitmexMarketModule } from './BitmexMarketModule'



export class BitmexPositionModule extends AAlunaModule implements Required<IAlunaPositionModule> {

  async list (): Promise<IAlunaPositionListReturns> {

    const requestCount = 0

    const {
      rawPositions,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      positions: parsedPositions,
      requestCount: parseManyCount,
    } = await this.parseMany({ rawPositions })

    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      positions: parsedPositions,
      requestCount: totalRequestCount,
    }

  }

  async listRaw ()
    : Promise<IAlunaPositionListRawReturns> {

    const { privateRequest } = BitmexHttp

    const {
      data: rawPositions,
      requestCount,
    } = await privateRequest<IBitmexPositionSchema[]>({
      url: `${PROD_BITMEX_URL}/position`,
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
      body: { filter: { isOpen: true } },
    })

    return {
      rawPositions,
      requestCount,
    }

  }

  async get (params: IAlunaPositionGetParams)
    : Promise<IAlunaPositionGetReturns> {

    const requestCount = 0

    const {
      rawPosition,
      requestCount: getRawCount,
    } = await this.getRaw(params)

    const {
      position: parsedPosition,
      requestCount: parseCount,
    } = await this.parse({ rawPosition })

    const totalRequestCount = requestCount
          + getRawCount
          + parseCount

    return {
      position: parsedPosition,
      requestCount: totalRequestCount,
    }

  }

  async getRaw (
    params: IAlunaPositionGetParams,
  ): Promise<IAlunaPositionGetRawReturns> {

    const {
      symbolPair,
    } = params

    if (!symbolPair) {

      const error = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: 'Position symbol is required to get Bitmex positions',
        httpStatusCode: 400,
      })

      BitmexLog.error(error)

      throw error

    }

    const { privateRequest } = BitmexHttp

    const {
      data,
      requestCount,
    } = await privateRequest<Array<IBitmexPositionSchema>>({
      url: `${PROD_BITMEX_URL}/position`,
      body: { filter: { symbol: symbolPair } },
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
    })

    const [rawPosition] = data

    return {
      rawPosition,
      requestCount,
    }

  }

  async close (
    params: IAlunaPositionCloseParams,
  ): Promise<IAlunaPositionCloseReturns> {

    const { symbolPair } = params

    if (!symbolPair) {

      const error = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: 'Position symbol is required to close Bitmex positions',
        httpStatusCode: 400,
      })

      BitmexLog.error(error)

      throw error

    }

    const { privateRequest } = BitmexHttp

    const requestCount = 0

    const {
      requestCount: privateRequestCount,
    } = await privateRequest<IBitmexOrderSchema>({
      url: `${PROD_BITMEX_URL}/order`,
      body: { execInst: 'Close', symbol: symbolPair },
      keySecret: this.exchange.keySecret,
    })

    const {
      position: parsedPosition,
      requestCount: getCount,
    } = await this.get({
      symbolPair,
    })

    const totalRequestCount = requestCount
      + privateRequestCount
      + getCount

    return {
      position: parsedPosition,
      requestCount: totalRequestCount,
    }

  }

  async parse (params: {
    rawPosition: IBitmexPositionSchema,
  }): Promise<IAlunaPositionParseReturns> {

    const { rawPosition } = params

    const { symbol } = rawPosition

    const requestCount = 0

    const {
      market: parsedMarket,
      requestCount: getCount,
    } = await BitmexMarketModule.get({
      id: symbol,
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

    const totalRequestCount = requestCount + getCount

    return {
      position: parsedPosition,
      requestCount: totalRequestCount,
    }

  }

  async parseMany (params: {
    rawPositions: any[],
  }): Promise<IAlunaPositionParseManyReturns> {

    const { rawPositions } = params

    let requestCount = 0

    const promises = map(rawPositions, async (rawPosition) => {

      const {
        position: parsedPosition,
        requestCount: parseCount,
      } = await this.parse({
        rawPosition,
      })

      requestCount += parseCount

      return parsedPosition

    })

    const parsedPositions = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedPositions.length} for Bitmex`)

    return {
      positions: parsedPositions,
      requestCount,
    }

  }

  async getLeverage (
    params: IAlunaPositionGetLeverageParams,
  ): Promise<IAlunaPositionGetLeverageReturns> {

    const { symbolPair } = params

    const requestCount = 0

    const {
      rawPosition: {
        leverage,
        crossMargin,
      },
      requestCount: getRawCount,
    } = await this.getRaw({ symbolPair })

    const computedLeverage = crossMargin
      ? 0
      : leverage

    const totalRequestCount = requestCount + getRawCount

    return {
      leverage: computedLeverage,
      requestCount: totalRequestCount,
    }

  }

  async setLeverage (
    params: IAlunaPositionSetLeverageParams,
  ): Promise<IAlunaPositionSetLeverageReturns> {

    const {
      leverage,
      symbolPair,
    } = params

    const { privateRequest } = BitmexHttp

    try {

      const {
        requestCount,
        data: {
          leverage: settedLeverage,
        },
      } = await privateRequest<IBitmexPositionSchema>({
        url: `${PROD_BITMEX_URL}/position/leverage`,
        body: { symbol: symbolPair, leverage },
        keySecret: this.exchange.keySecret,
      })

      return {
        requestCount,
        leverage: settedLeverage,
      }

    } catch (err) {

      let {
        code,
        message,
        metadata,
        httpStatusCode,
      } = err

      if (/(?=.*Account has zero)(?=.*margin balance).+/g.test(err.message)) {

        code = AlunaBalanceErrorCodes.INSUFFICIENT_BALANCE

        message = `Cannot set leverage for ${symbolPair} because of `
          .concat('insufficient balance')

        metadata = err.metadata

        httpStatusCode = 400

      }

      const alunaError = new AlunaError({
        code,
        message,
        metadata,
        httpStatusCode,
      })

      BitmexLog.error(alunaError)

      throw alunaError

    }

  }

}
