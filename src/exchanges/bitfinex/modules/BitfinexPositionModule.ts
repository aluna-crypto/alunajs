import { each } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaOrderSideEnum } from '../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaPositionSideEnum } from '../../../lib/enums/AlunaPositionSideEnum'
import { AlunaPositionStatusEnum } from '../../../lib/enums/AlunaPositionStatusEnum'
import { AlunaPositionErrorCodes } from '../../../lib/errors/AlunaPositionErrorCodes'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionCloseReturns,
  IAlunaPositionGetParams,
  IAlunaPositionGetRawReturns,
  IAlunaPositionGetReturns,
  IAlunaPositionListRawReturns,
  IAlunaPositionListReturns,
  IAlunaPositionModule,
  IAlunaPositionParseManyReturns,
  IAlunaPositionParseReturns,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexPositionSchema } from '../schemas/IBitfinexPositionSchema'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'



export class BitfinexPositionModule extends AAlunaModule implements IAlunaPositionModule {

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

  async listRaw (): Promise<IAlunaPositionListRawReturns> {

    const { privateRequest } = BitfinexHttp

    const {
      data: rawPositions,
      requestCount,
    } = await privateRequest<IBitfinexPositionSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: this.exchange.keySecret,
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

    const { id } = params

    const { privateRequest } = BitfinexHttp

    const {
      data,
      requestCount,
    } = await privateRequest<Array<IBitfinexPositionSchema>>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      body: { id: [Number(id)], limit: 1 },
      keySecret: this.exchange.keySecret,
    })

    if (!data.length) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.NOT_FOUND,
        message: 'Position not found',
        httpStatusCode: 400,
        metadata: data,
      })

      BitfinexLog.error(error)

      throw error

    }

    return {
      rawPosition: data[0],
      requestCount,
    }

  }

  async close (
    params: IAlunaPositionCloseParams,
  ): Promise<IAlunaPositionCloseReturns> {

    const { id } = params

    if (!id) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.DOESNT_HAVE_ID,
        message: 'Position id is required to close Bitfinex positions',
        httpStatusCode: 400,
      })

      BitfinexLog.error(error)

      throw error

    }

    const requestCount = 0

    const { position, requestCount: getCount } = await this.get({ id })

    if (position.status === AlunaPositionStatusEnum.CLOSED) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.ALREADY_CLOSED,
        message: 'Position is already closed',
        httpStatusCode: 400,
        metadata: position,
      })

      BitfinexLog.error(error)

      throw error

    }

    const {
      requestCount: placeMarketOrderCount,
    } = await this.placeMarketOrderToClosePosition({ position })

    const closedPosition: IAlunaPositionSchema = {
      ...position,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: new Date(),
    }


    const totalRequestCount = requestCount
      + getCount
      + placeMarketOrderCount

    return {
      position: closedPosition,
      requestCount: totalRequestCount,
    }

  }

  async parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }): Promise<IAlunaPositionParseReturns> {

    const { rawPosition } = params

    const parsedPosition = BitfinexPositionParser.parse({
      rawPosition,
    })

    return {
      position: parsedPosition,
      requestCount: 0,
    }

  }

  async parseMany (params: {
    rawPositions: IBitfinexPositionSchema[],
  }): Promise<IAlunaPositionParseManyReturns> {

    const { rawPositions } = params

    const parsedPositionsPromise: IAlunaPositionParseReturns[] = []

    let requestCount = 0

    each(rawPositions, (rawPosition) => {

      // skipping derivative positions for now
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const parsePositionResp = this.parse({ rawPosition })


      parsedPositionsPromise.push(parsePositionResp as any)

    })

    const parsedPositions = await
    Promise.all(parsedPositionsPromise).then((res) => {

      return res.map((parsedPositionResp) => {

        const {
          position: parsedPosition,
          requestCount: parseCount,
        } = parsedPositionResp

        requestCount += parseCount

        return parsedPosition

      })

    })

    return {
      positions: parsedPositions,
      requestCount,
    }

  }

  private async placeMarketOrderToClosePosition (params: {
    position: IAlunaPositionSchema,
  }): Promise<{ requestCount: number }> {

    const {
      position: {
        symbolPair,
        account,
        amount,
        side: positionSide,
      },
    } = params

    const invertedOrderSide = positionSide === AlunaPositionSideEnum.LONG
      ? AlunaOrderSideEnum.SELL
      : AlunaOrderSideEnum.BUY

    const { requestCount } = await this.exchange.order.place({
      account,
      side: invertedOrderSide,
      amount,
      symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
    })

    return {
      requestCount,
    }

  }

}
