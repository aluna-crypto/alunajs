import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
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
      transactTime,
      fills,
    } = rawOrder

    const updatedAt = updateTime ? new Date(updateTime) : undefined
    const amount = parseFloat(origQty)

    /**
     * It seems Binance does not return the price for filled orders, but it does
     * return a 'fills' prop when the placed order is filled immediately.
     */
    let rate = parseFloat(price)

    if (fills?.length) {

      rate = parseFloat(fills[0].price)


    }

    const orderStatus = BinanceStatusAdapter.translateToAluna({ from: status })

    let createdAt: Date
    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (time) {

      createdAt = new Date(time)

    } else if (transactTime) {

      createdAt = new Date(transactTime)

    } else {

      createdAt = new Date()

    }

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = updatedAt

    }

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      if (fills?.length) {

        filledAt = new Date()

      } else {

        filledAt = updatedAt

      }

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
