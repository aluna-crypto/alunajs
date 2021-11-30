import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { PROD_BINANCE_URL } from '../Binance'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'



export class BinanceOrderReadModule
  extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBinanceOrderSchema[]> {

    BinanceLog.info('fetching Binance open orders')

    const rawOrders = await BinanceHttp.privateRequest<IBinanceOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/openOrders`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrders

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    const rawOrders = await this.listRaw()

    const parsedOrders = this.parseMany({ rawOrders })

    return parsedOrders

  }



  public async getRaw (
    params: IAlunaOrderGetParams,
  ): Promise<IBinanceOrderSchema> {

    const {
      id,
      symbolPair,
    } = params

    BinanceLog.info('fetching Binance order status')

    const rawOrder = await BinanceHttp.privateRequest<IBinanceOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BINANCE_URL}/api/v3/order`,
      keySecret: this.exchange.keySecret,
      query: `&orderId=${id}&symbol=${symbolPair}`,
    })

    return rawOrder

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public parse (params: {
    rawOrder: IBinanceOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const parsedOrder = BinanceOrderParser.parse({ rawOrder })

    return parsedOrder

  }



  public parseMany (params: {
    rawOrders: IBinanceOrderSchema[],
  }): IAlunaOrderSchema[] {

    const { rawOrders } = params

    const parsedOrders = rawOrders.map((rawOrder: IBinanceOrderSchema) => {

      const parsedOrder = this.parse({ rawOrder })

      return parsedOrder

    })

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    return parsedOrders

  }

}
