import { AlunaOrderStatusEnum } from '../../../..'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { Binance } from '../../Binance'
import { BinanceOrderTypeAdapter } from '../../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceSideAdapter } from '../../enums/adapters/BinanceSideAdapter'
import { BinanceStatusAdapter } from '../../enums/adapters/BinanceStatusAdapter'
import { IBinanceMarketWithCurrency } from '../IBinanceMarketSchema'
import { IBinanceOrderSchema } from '../IBinanceOrderSchema'



export class BinanceOrderParser {

  static parse (params: {
    rawOrder: IBinanceOrderSchema,
    symbolInfo: IBinanceMarketWithCurrency,
  }): IAlunaOrderSchema {

    const { rawOrder, symbolInfo } = params

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
      updateTime,
    } = rawOrder

    const createdAt = time
      ? new Date(time).toISOString()
      : new Date().toISOString()
    const updatedAt = new Date(updateTime)
    const amount = parseFloat(origQty)
    const rate = parseFloat(price)

    const orderStatus = BinanceStatusAdapter.translateToAluna({ from: status })

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = updatedAt

    }

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = updatedAt

    }

    const parsedOrder: IAlunaOrderSchema = {
      id: orderId,
      symbolPair: symbol,
      total: amount * rate,
      amount,
      rate,
      exchangeId,
      baseSymbolId: symbolInfo.baseCurrency,
      quoteSymbolId: symbolInfo.quoteCurrency,
      account: AlunaAccountEnum.EXCHANGE,
      side: BinanceSideAdapter.translateToAluna({ from: side }),
      status: orderStatus,
      type: BinanceOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(createdAt),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
