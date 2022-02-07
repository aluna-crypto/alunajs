import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import { BittrexHttp } from '../BittrexHttp'
import { BittrexLog } from '../BittrexLog'
import { PROD_BITTREX_URL } from '../BittrexSpecs'
import { IBittrexOrderSchema } from '../schemas/IBittrexOrderSchema'
import { BittrexOrderParser } from '../schemas/parses/BittrexOrderParser'
import { BittrexMarketModule } from './BittrexMarketModule'



export class BittrexOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public async listRaw (): Promise<IBittrexOrderSchema[]> {

    BittrexLog.info('fetching Bittrex open orders')

    const rawOrders = await BittrexHttp.privateRequest<IBittrexOrderSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/open`,
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
  ): Promise<IBittrexOrderSchema> {

    const {
      id,
    } = params

    BittrexLog.info('fetching Bittrex order status')

    const rawOrder = await BittrexHttp.privateRequest<IBittrexOrderSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_BITTREX_URL}/orders/${id}`,
      keySecret: this.exchange.keySecret,
    })

    return rawOrder

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const rawOrder = await this.getRaw(params)

    const parsedOrder = this.parse({ rawOrder })

    return parsedOrder

  }



  public async parse (params: {
    rawOrder: IBittrexOrderSchema,
  }): Promise<IAlunaOrderSchema> {

    const { rawOrder } = params

    const { marketSymbol } = rawOrder

    const symbols = await BittrexMarketModule.listRaw()

    const symbolInfo = symbols.find((s) => s.symbol === marketSymbol)

    const parsedOrder = BittrexOrderParser.parse({ rawOrder, symbolInfo })

    return parsedOrder

  }



  public async parseMany (params: {
    rawOrders: IBittrexOrderSchema[],
  }): Promise<IAlunaOrderSchema[]> {

    const { rawOrders } = params

    const parsedOrders = await Promise.all(
      rawOrders.map(async (rawOrder: any) => {

        const parsedOrder = await this.parse({ rawOrder })

        return parsedOrder

      }),
    )

    BittrexLog.info(`parsed ${parsedOrders.length} orders for Bittrex`)

    return parsedOrders

  }

}
