import { AAlunaModule } from '../../../lib/core/abstracts/AAlunaModule'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import {
  IAlunaOrderGetParams,
  IAlunaOrderReadModule,
} from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaOrderSchema } from '../../../lib/schemas/IAlunaOrderSchema'
import {
  IValrOrderGetSchema,
  IValrOrderListSchema,
} from '../schemas/IValrOrderSchema'
import { ValrOrderParser } from '../schemas/parsers/ValrOrderParser'
import { ValrHttp } from '../ValrHttp'
import { ValrLog } from '../ValrLog'



export class ValrOrderReadModule extends AAlunaModule implements IAlunaOrderReadModule {

  public listRaw (): Promise<IValrOrderListSchema[]> {

    ValrLog.info('fetching Valr open orders')

    return ValrHttp.privateRequest<IValrOrderListSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: 'https://api.valr.com/v1/orders/open',
      keySecret: this.exchange.keySecret,
    })

  }



  public async list (): Promise<IAlunaOrderSchema[]> {

    return this.parseMany({
      rawOrders: await this.listRaw(),
    })

  }



  public getRaw (params: IAlunaOrderGetParams): Promise<IValrOrderGetSchema> {

    const {
      id,
      symbolPair,
    } = params

    ValrLog.info('fetching Valr order status')

    return ValrHttp.privateRequest<IValrOrderGetSchema>({
      verb: AlunaHttpVerbEnum.GET,
      url: `https://api.valr.com/v1/orders/${symbolPair}/orderid/${id}`,
      keySecret: this.exchange.keySecret,
    })

  }



  public async get (params: IAlunaOrderGetParams): Promise<IAlunaOrderSchema> {

    const order = await this.getRaw(params)

    return this.parse({
      rawOrder: order,
    })

  }



  public parse (params: {
    rawOrder: IValrOrderListSchema | IValrOrderGetSchema,
  }): IAlunaOrderSchema {

    return ValrOrderParser.parse({
      rawOrder: params.rawOrder,
    })

  }



  public parseMany (params: {
    rawOrders: IValrOrderListSchema[],
  }): IAlunaOrderSchema[] {

    const parsedOrders = params.rawOrders.map((
      rawOrder: IValrOrderListSchema,
    ) => this.parse({
      rawOrder,
    }))

    ValrLog.info(`parsed ${parsedOrders.length} orders for Valr`)

    return parsedOrders

  }

}
