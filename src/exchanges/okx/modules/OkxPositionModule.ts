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
import { OkxHttp } from '../OkxHttp'
import { OkxLog } from '../OkxLog'
import { PROD_OKX_URL } from '../OkxSpecs'
import { IOkxPositionCloseResp, IOkxPositionSchema, IOkxSetPositionLeverageResp } from '../schemas/IOkxPositionSchema'
import { OkxPositionParser } from '../schemas/parsers/OkxPositionParser'



export class OkxPositionModule extends AAlunaModule implements Required<IAlunaPositionModule> {

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

    const { privateRequest } = OkxHttp

    const {
      data: rawPositions,
      requestCount,
    } = await privateRequest<IOkxPositionSchema[]>({
      url: `${PROD_OKX_URL}/account/positions`,
      keySecret: this.exchange.keySecret,
      verb: AlunaHttpVerbEnum.GET,
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
        message: 'Position symbol is required to get Okx positions',
        httpStatusCode: 400,
      })

      OkxLog.error(error)

      throw error

    }

    const { privateRequest } = OkxHttp

    const {
      data,
      requestCount,
    } = await privateRequest<Array<IOkxPositionSchema>>({
      url: `${PROD_OKX_URL}/account/positions`,
      keySecret: this.exchange.keySecret,
      query: `instId=${symbolPair}`,
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

    const { symbolPair, id } = params

    if (!symbolPair) {

      const error = new AlunaError({
        code: AlunaGenericErrorCodes.PARAM_ERROR,
        message: 'Position symbol is required to close Okx positions',
        httpStatusCode: 400,
      })

      OkxLog.error(error)

      throw error

    }

    const { privateRequest } = OkxHttp

    const requestCount = 0

    const body = {
      ordId: id,
      instId: symbolPair,
    }

    const {
      data: [data],
      requestCount: privateRequestCount,
    } = await privateRequest<IOkxPositionCloseResp[]>({
      url: `${PROD_OKX_URL}/trade/cancel-order`,
      body,
      keySecret: this.exchange.keySecret,
    })

    if (data.sCode === '51400') {

      throw new AlunaError({
        message: data.sMsg,
        httpStatusCode: 404,
        code: AlunaGenericErrorCodes.NOT_FOUND,
      })

    }

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
    rawPosition: IOkxPositionSchema,
  }): Promise<IAlunaPositionParseReturns> {

    const { rawPosition } = params

    const requestCount = 0

    const parsedPosition = OkxPositionParser.parse({
      rawPosition,
    })

    return {
      position: parsedPosition,
      requestCount,
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

    OkxLog.info(`parsed ${parsedPositions.length} for Okx`)

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
        lever,
      },
      requestCount: getRawCount,
    } = await this.getRaw({ symbolPair })

    const computedLeverage = Number(lever)

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

    const { privateRequest } = OkxHttp

    const body = {
      instId: symbolPair,
      lever: leverage.toString(),
      mgnMode: 'cross',
    }

    const {
      requestCount,
      data: [data],
    } = await privateRequest<IOkxSetPositionLeverageResp[]>({
      url: `${PROD_OKX_URL}/account/set-leverage`,
      body,
      keySecret: this.exchange.keySecret,
    })

    const { lever } = data

    return {
      requestCount,
      leverage: Number(lever),
    }

  }

}
