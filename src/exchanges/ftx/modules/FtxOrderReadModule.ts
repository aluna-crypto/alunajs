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
      requestCount,
    } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema[]>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders`,
        keySecret: this.exchange.keySecret,
      })

    return {
      rawOrders: result,
      requestCount,
    }

  }



  public async list (): Promise<IAlunaOrderListReturns> {

    const requestCount = 0

    const {
      rawOrders,
      requestCount: listRawCount,
    } = await this.listRaw()

    const {
      orders: parsedOrders,
      requestCount: parseManyCount,
    } = await this.parseMany({ rawOrders })


    const totalRequestCount = requestCount
      + listRawCount
      + parseManyCount

    return {
      orders: parsedOrders,
      requestCount: totalRequestCount,
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
      requestCount,
    } = await FtxHttp
      .privateRequest<IFtxResponseSchema<IFtxOrderSchema>>({
        verb: AlunaHttpVerbEnum.GET,
        url: `${PROD_FTX_URL}/orders/${id}`,
        keySecret: this.exchange.keySecret,
      })

    return {
      rawOrder: result,
      requestCount,
    }

  }



  public async get (params: IAlunaOrderGetParams)
    : Promise<IAlunaOrderGetReturns> {

    const requestCount = 0

    const {
      rawOrder,
      requestCount: getRawCount,
    } = await this.getRaw(params)

    const {
      order: parsedOrder,
      requestCount: parseCount,
    } = await this.parse({ rawOrder })

    const totalRequestCount = requestCount
      + getRawCount
      + parseCount

    return {
      order: parsedOrder,
      requestCount: totalRequestCount,
    }


  }



  public async parse (params: {
    rawOrder: IFtxOrderSchema,
  }): Promise<IAlunaOrderParseReturns> {

    const { rawOrder } = params

    const parsedOrder = FtxOrderParser.parse({ rawOrder })

    return {
      order: parsedOrder,
      requestCount: 0,
    }

  }



  public async parseMany (params: {
    rawOrders: IFtxOrderSchema[],
  }): Promise<IAlunaOrderParseManyReturns> {

    const { rawOrders } = params

    let requestCount = 0

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: IFtxOrderSchema) => {

        const {
          order: parsedOrder,
          requestCount: parseCount,
        } = await this.parse({ rawOrder })

        requestCount += parseCount

        return parsedOrder

      }),
    )

    FtxLog.info(`parsed ${parsedOrders.length} orders for Ftx`)

    return {
      orders: parsedOrders,
      requestCount,
    }

  }

}
