import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { Binance } from '../../Binance'
import { BinanceOrderTypeAdapter } from '../../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceSideAdapter } from '../../enums/adapters/BinanceSideAdapter'
import { BinanceStatusAdapter } from '../../enums/adapters/BinanceStatusAdapter'
import { IBinanceOrderSchema } from '../IBinanceOrderSchema'



export class BinanceOrderParser {

  static parse (params: {
    rawOrder: IBinanceOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const exchangeId = Binance.ID

    const {
      orderId,
      time,
      origQty,
      symbol,
      side,
      price,
      type,
      status,
    } = rawOrder

    // TODO: Should use UTC date instead (moment? - Fix all occurrencies)
    const createdAt = new Date(time * 1000).toString()
    const amount = parseFloat(origQty)
    const rate = parseFloat(price)

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      total: amount * rate,
      amount,
      rate,  
      exchangeId,
      baseSymbolId: '', // TODO Update here
      quoteSymbolId: '', // TODO Update here
      account: AlunaAccountEnum.EXCHANGE,
      side: BinanceSideAdapter.translateToAluna({ from: side }),
      status: BinanceStatusAdapter.translateToAluna({ from: status }),
      type: BinanceOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(createdAt),
      meta: rawOrder,
    }

    return parsedOrder

  }

}
