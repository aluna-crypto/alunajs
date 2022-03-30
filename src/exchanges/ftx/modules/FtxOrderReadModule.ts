import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderGetRawReturns,
  IAlunaOrderGetReturns,
  IAlunaOrderListRawReturns,
  IAlunaOrderListReturns,
  IAlunaOrderParseManyReturns,
  IAlunaOrderParseReturns,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { FtxHttp } from '../FtxHttp'
import { FtxLog } from '../FtxLog'
import { PROD_FTX_URL } from '../FtxSpecs'
import { IFtxOrderSchema } from '../schemas/IFtxOrderSchema'
import { IFtxResponseSchema } from '../schemas/IFtxSchema'
import { FtxOrderParser } from '../schemas/parsers/FtxOrderParser'



export class FtxOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw ()
    : Promise<IAlunaOrderListRawReturns<IFtxOrderSchema>> {

    FtxLog.info('fetching Ftx open orders')

    const {
      data: { result },
      apiRequestCount,
    } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema[]>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders`,
        keySecret: this.exchange.keySecret,
      })

    return {
      rawOrders: result,
      apiRequestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    let apiRequestCount = 0

    const {
      rawOrders,
      apiRequestCount: listRawCount,
    } = await this.listRaw()

    apiRequestCount += 1

    const {
      orders: parsedOrders,
      apiRequestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })

    apiRequestCount += 1

    const totalApiRequestCount = apiRequestCount
      + listRawCount
      + parseManyCount

    return {
      orders: parsedOrders,
      apiRequestCount: totalApiRequestCount,
    }

  }



  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IAlunaOrderGetRawReturns> {

    const {
      id,
    } = params

    FtxLog.info('fetching Ftx order status')

    const {
      data: { result },
      apiRequestCount,
    } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders/${id}`,
        keySecret: this.exchange.keySecret,
      })

    return {
      rawOrder: result,
      apiRequestCount,
    }

  }



  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    const apiRequestCount = 0

    const {
      rawOrder,
      apiRequestCount: getRawCount,
    } = await this.getRaw(params)

    const {
      order: parsedOrder,
      apiRequestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalApiRequestCount = apiRequestCount
      + getRawCount
      + parseCount

    return {
      order: parsedOrder,
      apiRequestCount: totalApiRequestCount,
    }


  }



  public async parse (params: {
    rawOrder: IFtxOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = FtxOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      apiRequestCount: 1,
    }

  }



  public async parseMany (params: {
    rawOrders: IFtxOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let apiRequestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: IFtxOrderSchema) => {

        const {
          order: parsedOrder,
          apiRequestCount: parseCount,
        } = await this.parse({ rawOrder })

        apiRequestCount += parseCount + 1

        return parsedOrder

      }),
    )

    FtxLog.info(`parsed ${parsedOrders.length} orders for Ftx`)

    return {
      orders: parsedOrders,
      apiRequestCount,
    }

  }

}
