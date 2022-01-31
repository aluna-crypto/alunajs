import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'
import { PROD_BINANCE_URL } from '../BinanceSpecs'
import { IBinanceOrderSchema } from '../schemas/IBinanceOrderSchema'
import { BinanceOrderParser } from '../schemas/parses/BinanceOrderParser'



export class BinanceOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

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



  public async parse (params: {
    rawOrder: IBinanceOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const parsedOrder = BinanceOrderParser.parse({ rawOrder })

    return parsedOrder

  }



  public async parseMany (params: {
    rawOrders: IBinanceOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const parsedOrders = await Promise.all(rawOrders.map(async (rawOrder: IBinanceOrderSchema) => {

      const parsedOrder = await this.parse({ rawOrder })

      return parsedOrder

    }))

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    return parsedOrders

  }

}
