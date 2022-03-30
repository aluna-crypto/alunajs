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

  async listRaw (): Promise<IAlunaPositionListRawReturns> {

    const { privateRequest } = BitfinexHttp

    const {
      data: rawPositions,
      apiRequestCount,
    } = await privateRequest<IBitfinexPositionSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: this.exchange.keySecret,
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

    const { id } = params

    const { privateRequest } = BitfinexHttp

    const {
      data,
      apiRequestCount,
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
      })

      BitfinexLog.error(error)

      throw error

    }

    return {
      rawPosition: data[0],
      apiRequestCount,
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

    let apiRequestCount = 0

    const { position, apiRequestCount: getCount } = await this.get({ id })

    apiRequestCount += 1

    if (position.status === AlunaPositionStatusEnum.CLOSED) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.ALREADY_CLOSED,
        message: 'Position is already closed',
        httpStatusCode: 400,
      })

      BitfinexLog.error(error)

      throw error

    }

    const {
      apiRequestCount: placeMarketOrderCount,
    } = await this.placeMarketOrderToClosePosition({ position })

    apiRequestCount += 1

    const closedPosition: IAlunaPositionSchema = {
      ...position,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: new Date(),
    }


    const totalApiRequestCount = apiRequestCount
      + getCount
      + placeMarketOrderCount

    return {
      position: closedPosition,
      apiRequestCount: totalApiRequestCount,
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
      apiRequestCount: 1,
    }

  }

  async parseMany (params: {
    rawPositions: IBitfinexPositionSchema[],
  }): Promise<IAlunaPositionParseManyReturns> {

    const { rawPositions } = params

    const parsedPositionsPromise: IAlunaPositionParseReturns[] = []

    let apiRequestCount = 0

    each(rawPositions, (rawPosition) => {

      // skipping derivative positions for now
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const parsePositionResp = this.parse({ rawPosition })

      apiRequestCount += 1

      parsedPositionsPromise.push(parsePositionResp as any)

    })

    const parsedPositions = await
    Promise.all(parsedPositionsPromise).then((res) => {

      return res.map((parsedPositionResp) => {

        const {
          position: parsedPosition,
          apiRequestCount: parseCount,
        } = parsedPositionResp

        apiRequestCount += parseCount

        return parsedPosition

      })

    })

    return {
      positions: parsedPositions,
      apiRequestCount,
    }

  }

  private async placeMarketOrderToClosePosition (params: {
    position: IAlunaPositionSchema,
  }): Promise<{ apiRequestCount: number }> {

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

    const { apiRequestCount } = await this.exchange.order.place({
      account,
      side: invertedOrderSide,
      amount,
      symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
    })

    return {
      apiRequestCount,
    }

  }

}
