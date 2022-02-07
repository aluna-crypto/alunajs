import { IAlunaPositionModule } from '../../..'
import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import {
  IAlunaPositionCloseParams,
  IAlunaPositionGetParams,
  IAlunaPositionListParams,
} from '../../../lib/modules/IAlunaPositionModule'
import { IAlunaPositionSchema } from '../../../lib/schemas/IAlunaPositionSchema'
import { BitfinexHttp } from '../BitfinexHttp'
import { IBitfinexPositionSchema } from '../schemas/IBitfinexPositionSchema'



export class BitfinexPositionModule extends AAlunaModule implements IAlunaPositionModule {

  list (params?: IAlunaPositionListParams): Promise<IAlunaPositionSchema[]> {

    throw new Error('Method not implemented.')

  }

  async listRaw (
    params?: IAlunaPositionListParams,
  ): Promise<IBitfinexPositionSchema[]> {

    let url = 'https://api.bitfinex.com/v2/auth/r/positions'
    const body: Record<string, any> = {}

    if (params) {

      const { end, start, openPositionsOnly } = params

      if (!openPositionsOnly && end && start) {

        body.start = start
        body.end = end

        url = 'https://api.bitfinex.com/v2/auth/r/positions/snap'

      }

    }

    const { privateRequest } = BitfinexHttp

    const rawPositions = await privateRequest<IBitfinexPositionSchema[]>({
      url,
      body,
      keySecret: this.exchange.keySecret,
    })

    return rawPositions

  }

  get (params?: IAlunaPositionGetParams): Promise<IAlunaPositionSchema> {

    throw new Error('Method not implemented.')

  }
  getRaw (params?: IAlunaPositionGetParams): Promise<any> {

    throw new Error('Method not implemented.')

  }
  close (params: IAlunaPositionCloseParams): Promise<IAlunaPositionSchema> {

    throw new Error('Method not implemented.')

  }
  parse (params: { rawPosition: any }): IAlunaPositionSchema {

    throw new Error('Method not implemented.')

  }
  parseMany (parms: { rawPositions: any[] }): IAlunaPositionSchema[] {

    throw new Error('Method not implemented.')

  }

}
