import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BinanceHttp } from '../BinanceHttp'
import { BinanceLog } from '../BinanceLog'



export class BinanceOrderReadModule 
  extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<any[]> { // @TODO -> Update any

    BinanceLog.info('fetching Binance open orders')

    const rawOrders = await BinanceHttp.privateRequest<any[]>({
      verb: AlunaHttpVerbEnum.GET, // @TODO -> Update any
      url: 'https://api.binance.com/v1/orders/open',
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
  ): Promise<any> { // @TODO -> Update any

    const {
      id,
      symbolPair,
    } = params

    BinanceLog.info('fetching Binance order status')

    const rawOrder = await BinanceHttp.privateRequest<any>({
      verb: AlunaHttpVerbEnum.GET, // @TODO -> Update any
      url: `https://api.binance.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public parse (params: {
    rawOrder: any, // @TODO -> Update any
  }): any { // @TODO -> Update any

    const { rawOrder } = params

    // const parsedOrder = BinanceOrderParser.parse({ rawOrder })

    // return parsedOrder

  }



  public parseMany (params: {
    rawOrders: any[], // @TODO -> Update any
  }): IAlunaOrderSchema[] {

    const { rawOrders } = params

    const parsedOrders = rawOrders.map((rawOrder: any) => {
    // @TODO -> Update any
      const parsedOrder = this.parse({ rawOrder })

      return parsedOrder

    })

    BinanceLog.info(`parsed ${parsedOrders.length} orders for Binance`)

    return parsedOrders

  }

}
