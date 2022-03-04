import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxOrderSchema } from '../schemas/IFtxOrderSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'
import { FtxOrderParser } from '../schemas/parsers/FtxOrderParser'



export class FtxOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IFtxOrderSchema[]> {

    FtxLog.info('fetching Ftx open orders')

    const { result } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema[]>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders`,
        keySecret: this.exchange.keySecret,
      })

    return result

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = this.parseMany({ rawOrders })

    return parsedOrders

  }



  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IFtxOrderSchema> {

    const {
      id,
    } = params

    FtxLog.info('fetching Ftx order status')

    const { result } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders/${id}`,
        keySecret: this.exchange.keySecret,
      })

    return result

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public async parse (params: {
    rawOrder: IFtxOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const parsedOrder = FtxOrderParser.parse({ rawOrder })

    return parsedOrder

  }



  public async parseMany (params: {
    rawOrders: IFtxOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: IFtxOrderSchema) => {

        const parsedOrder = await this.parse({ rawOrder })

        return parsedOrder

      }),
    )

    FtxLog.info(`parsed ${parsedOrders.length} orders for Ftx`)

    return parsedOrders

  }

}
