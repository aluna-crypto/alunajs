import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { BinanceOrderStatusEnum } from '../../enums/BinanceOrderStatusEnum'
import { BinanceOrderTypeEnum } from '../../enums/BinanceOrderTypeEnum'
import { BinanceSideEnum } from '../../enums/BinanceSideEnum'
import { IBinanceOrderSchema } from '../IBinanceOrderSchema'



export class BinanceOrderParser {

  static parse (params: {
    rawOrder: IBinanceOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const {
      orderId,
      time,
      origQty,
      symbol
    } = rawOrder

    let side: BinanceSideEnum
    let price: string
    let status: BinanceOrderStatusEnum
    let type: BinanceOrderTypeEnum
    let createdAt: string

    ({
      side,
      price,
      type,
      status,
    } = rawOrder)
    
    createdAt = new Date(time * 1000).toString()


    const amount = parseFloat(origQty)
    const rate = parseFloat(price)

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      total: amount * rate,
      amount,
      isAmountInContracts: false,
      rate,
      account: AlunaAccountEnum.EXCHANGE,
      side: side as any, // @TODO -> Update to include Adapter
      status: status as any, // @TODO -> Update to include Adapter
      type: type as any, // @TODO -> Update to include Adapter
      placedAt: new Date(createdAt),
      meta: rawOrder,
    }

    return parsedOrder
  }

}
