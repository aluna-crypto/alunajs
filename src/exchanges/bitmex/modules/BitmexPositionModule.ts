import { map } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
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

    let apiRequestCount = 0

    const {
      rawPositions,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      positions: parsedPositions,
      apiRequestCount: parseManyCount,
    } = await this.parseMany({ rawPositions })

    apiRequestCount += 1


    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      positions: parsedPositions,
      apiRequestCount: totalApiRequestCount,
    }

  }

  async listRaw ()
    : Promise<IAlunaPositionListRawReturns> {

    const { privateRequest } = BitmexHttp

    const {
      data: rawPositions,
      apiRequestCount,
    } = await privateRequest<IBitmexPositionSchema[]>({
      url: `${PROD_BITMEX_URL}/position`,
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
      body: { filter: { isOpen: true } },
    })

    return {
      rawPositions,
      apiRequestCount,
    }

  }

  async get (params: IAlunaPositionGetParams)
    : Promise<IAlunaPositionGetReturns> {

    let apiRequestCount = 0

    const {
      rawPosition,
      apiRequestCount: getRawCount,
    } = await this.getRaw(params)

    apiRequestCount += 1

    const {
      position: parsedPosition,
      apiRequestCount: parseCount,
    } = await this.parse({ rawPosition })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
          + getRawCount
          + parseCount

    return {
      position: parsedPosition,
      apiRequestCount: totalApiRequestCount,
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
      apiRequestCount,
    } = await privateRequest<Array<IBitmexPositionSchema>>({
      url: `${PROD_BITMEX_URL}/position`,
      body: { filter: { symbol: symbolPair } },
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
    })

    const [rawPosition] = data

    return {
      rawPosition,
      apiRequestCount,
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

    let apiRequestCount = 0

    const {
      apiRequestCount: requestCount,
    } = await privateRequest<IBitmexOrderSchema>({
      url: `${PROD_BITMEX_URL}/order`,
      body: { execInst: 'Close', symbol: symbolPair },
      keySecret: this.exchange.keySecret,
    })

    apiRequestCount += 1

    const {
      position: parsedPosition,
      apiRequestCount: getCount,
    } = await this.get({
      symbolPair,
    })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + requestCount
      + getCount

    return {
      position: parsedPosition,
      apiRequestCount: totalApiRequestCount,
    }

  }

  async parse (params: {
    rawPosition: IBitmexPositionSchema,
  }): Promise<IAlunaPositionParseReturns> {

    const { rawPosition } = params

    const { symbol } = rawPosition

    let apiRequestCount = 0

    const {
      market: parsedMarket,
      apiRequestCount: getCount,
    } = await BitmexMarketModule.get({
      id: symbol,
    })

    apiRequestCount += 1

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

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount + getCount

    return {
      position: parsedPosition,
      apiRequestCount: totalApiRequestCount,
    }

  }

  async parseMany (params: {
    rawPositions: any[],
  }): Promise<IAlunaPositionParseManyReturns> {

    const { rawPositions } = params

    let apiRequestCount = 0

    const promises = map(rawPositions, async (rawPosition) => {

      const {
        position: parsedPosition,
        apiRequestCount: parseCount,
      } = await this.parse({
        rawPosition,
      })

      apiRequestCount += parseCount + 1

      return parsedPosition

    })

    const parsedPositions = await Promise.all(promises)

    BitmexLog.info(`parsed ${parsedPositions.length} for Bitmex`)

    return {
      positions: parsedPositions,
      apiRequestCount,
    }

  }

  async getLeverage (
    params: IAlunaPositionGetLeverageParams,
  ): Promise<IAlunaPositionGetLeverageReturns> {

    const { symbolPair } = params

    let apiRequestCount = 0

    const {
      rawPosition: {
        leverage,
        crossMargin,
      },
      apiRequestCount: getRawCount,
    } = await this.getRaw({ symbolPair })

    apiRequestCount += 1

    const computedLeverage = crossMargin
      ? 0
      : leverage

    const totalApiRequestCount = apiRequestCount + getRawCount

    return {
      leverage: computedLeverage,
      apiRequestCount: totalApiRequestCount,
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

    const {
      data: {
        leverage: settedLeverage,
      },
      apiRequestCount,
    } = await privateRequest<IBitmexPositionSchema>({
      url: `${PROD_BITMEX_URL}/position/leverage`,
      body: { symbol: symbolPair, leverage },
      keySecret: this.exchange.keySecret,
    })

    return {
      leverage: settedLeverage,
      apiRequestCount,
    }

  }

}
