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
  IAlunaPositionGetParams,
  IAlunaPositionModule,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexPositionSchema } from '../schemas/IBitfinexPositionSchema'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'



export class BitfinexPositionModule extends AAlunaModule implements IAlunaPositionModule {

  async list (): Promise<IAlunaPositionSchema[]> {

    const rawPositions = await this.listRaw()

    const parsedPositions = this.parseMany({ rawPositions })

    return parsedPositions

  }

  async listRaw (): Promise<IBitfinexPositionSchema[]> {

    const { privateRequest } = BitfinexHttp

    const rawPositions = await privateRequest<IBitfinexPositionSchema[]>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions',
      keySecret: this.exchange.keySecret,
    })

    return rawPositions

  }

  async get (params: IAlunaPositionGetParams): Promise<IAlunaPositionSchema> {

    const rawPosition = await this.getRaw(params)

    const parsedPosition = this.parse({ rawPosition })

    return parsedPosition

  }

  async getRaw (
    params: IAlunaPositionGetParams,
  ): Promise<IBitfinexPositionSchema> {

    const { id } = params

    const { privateRequest } = BitfinexHttp

    const response = await privateRequest<Array<IBitfinexPositionSchema>>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      body: { id: [Number(id)], limit: 1 },
      keySecret: this.exchange.keySecret,
    })

    if (!response.length) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.NOT_FOUND,
        message: 'Position not found',
        httpStatusCode: 400,
      })

      BitfinexLog.error(error)

      throw error

    }

    return response[0]

  }

  async close (
    params: IAlunaPositionCloseParams,
  ): Promise<IAlunaPositionSchema> {

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

    const position = await this.get({ id })

    if (position.status === AlunaPositionStatusEnum.CLOSED) {

      const error = new AlunaError({
        code: AlunaPositionErrorCodes.ALREADY_CLOSED,
        message: 'Position is already closed',
        httpStatusCode: 400,
      })

      BitfinexLog.error(error)

      throw error

    }

    await this.placeMarketOrderToClosePosition({ position })

    const closedPosition: IAlunaPositionSchema = {
      ...position,
      status: AlunaPositionStatusEnum.CLOSED,
      closedAt: new Date(),
    }

    return closedPosition

  }

  async parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }): Promise<IAlunaPositionSchema> {

    const { rawPosition } = params

    const parsedPosition = BitfinexPositionParser.parse({
      rawPosition,
    })

    return parsedPosition

  }

  async parseMany (params: {
    rawPositions: IBitfinexPositionSchema[],
  }): Promise<IAlunaPositionSchema[]> {

    const { rawPositions } = params

    const parsedPositionsPromise: Promise<IAlunaPositionSchema>[] = []

    each(rawPositions, async (rawPosition) => {

      // skipping derivative positions for now
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return

      }

      const parsedPosition = this.parse({ rawPosition })

      parsedPositionsPromise.push(parsedPosition)

    })

    const parsedPositions = await Promise.all(parsedPositionsPromise)

    return parsedPositions

  }

  private async placeMarketOrderToClosePosition (params: {
    position: IAlunaPositionSchema,
  }): Promise<void> {

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

    await this.exchange.order.place({
      account,
      side: invertedOrderSide,
      amount,
      symbolPair,
      type: AlunaOrderTypesEnum.MARKET,
    })

  }

}
