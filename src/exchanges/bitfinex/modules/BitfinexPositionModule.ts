import { each } from 'lodash'

import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaError } from '../../../lib/core/AlunaError'
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

    const [rawPosition] = data

    return {
      rawPosition,
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

    const { privateRequest } = BitfinexHttp

    const { apiRequestCount: requestCount } = await privateRequest<void>({
      url: 'https://api.bitfinex.com/v1/position/close',
      body: { position_id: Number(id) },
      keySecret: this.exchange.keySecret,
    })

    apiRequestCount += 1

    const {
      position: parsedPosition,
      apiRequestCount: getCount,
    } = await this.get({ id })

    apiRequestCount += 1

    if (parsedPosition.status !== AlunaPositionStatusEnum.CLOSED) {

      const error = new AlunaError({
        message: 'Position could not be closed',
        code: AlunaPositionErrorCodes.COULD_NOT_BE_CLOSED,
        httpStatusCode: 500,
      })

      BitfinexLog.error(error)

      throw error

    }

    const totalApiRequestCount = apiRequestCount
      + getCount
      + requestCount

    return {
      position: parsedPosition,
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

    const parsedPositionsPromise: IAlunaPositionSchema[] = []

    let apiRequestCount = 0

    each(rawPositions, async (rawPosition) => {

      // skipping derivative positions for now
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const {
        position: parsedPosition,
        apiRequestCount: parseCount,
      } = await this.parse({ rawPosition })

      apiRequestCount += parseCount + 1

      parsedPositionsPromise.push(parsedPosition)

    })

    const parsedPositions = await Promise.all(parsedPositionsPromise)

    return {
      positions: parsedPositions,
      apiRequestCount,
    }

  }

}
