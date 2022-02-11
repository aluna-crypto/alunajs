import {
  AlunaError,
  AlunaPositionErrorCodes,
  AlunaPositionStatusEnum,
  IAlunaPositionModule,
} from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionGetParams,
  IAlunaPositionListParams,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { BitfinexLog } from '../BitfinexLog'
import { IBitfinexPositionSchema } from '../schemas/IBitfinexPositionSchema'
import { BitfinexPositionParser } from '../schemas/parsers/BitfinexPositionParser'



export class BitfinexPositionModule extends AAlunaModule implements IAlunaPositionModule {

  async list (
    params?: IAlunaPositionListParams,
  ): Promise<IAlunaPositionSchema[]> {

    const rawPositions = await this.listRaw(params)

    const parsedPositions = this.parseMany({ rawPositions })

    return parsedPositions

  }

  async listRaw (
    params?: IAlunaPositionListParams,
  ): Promise<IBitfinexPositionSchema[]> {

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

    const [rawPosition] = await privateRequest<Array<IBitfinexPositionSchema>>({
      url: 'https://api.bitfinex.com/v2/auth/r/positions/audit',
      body: { id: [id], limit: 1 },
      keySecret: this.exchange.keySecret,
    })

    return rawPosition

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

    const { privateRequest } = BitfinexHttp

    await privateRequest<void>({
      url: 'https://api.bitfinex.com/v1/position/close',
      body: { position_id: Number(id) },
      keySecret: this.exchange.keySecret,
    })

    const parsedPosition = await this.get({ id: id.toString() })

    if (parsedPosition.status !== AlunaPositionStatusEnum.CLOSED) {

      const error = new AlunaError({
        message: 'Position could not be closed',
        code: AlunaPositionErrorCodes.COULD_NOT_BE_CLOSED,
        httpStatusCode: 500,
      })

      BitfinexLog.error(error)

      throw error

    }

    return parsedPosition

  }

  parse (params: {
    rawPosition: IBitfinexPositionSchema,
  }): IAlunaPositionSchema {

    const { rawPosition } = params

    const parsedPosition = BitfinexPositionParser.parse({
      rawPosition,
    })

    return parsedPosition

  }

  parseMany (params: {
    rawPositions: IBitfinexPositionSchema[],
  }): IAlunaPositionSchema[] {

    const { rawPositions } = params

    const parsedPositions = rawPositions.reduce((acc, rawPosition) => {

      // skipping derivative positions for now
      if (/^(f)|(F0)/.test(rawPosition[0])) {

        return acc

      }

      const parsedPosition = this.parse({ rawPosition })

      acc.push(parsedPosition)

      return acc

    }, [] as IAlunaPositionSchema[])

    return parsedPositions

  }

}
