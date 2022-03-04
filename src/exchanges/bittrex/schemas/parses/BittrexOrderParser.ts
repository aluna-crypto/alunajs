import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bittrex } from '../../Bittrex'
import { BittrexOrderTypeAdapter } from '../../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexSideAdapter } from '../../enums/adapters/BittrexSideAdapter'
import { BittrexStatusAdapter } from '../../enums/adapters/BittrexStatusAdapter'
import { BittrexOrderStatusEnum } from '../../enums/BittrexOrderStatusEnum'
import { IBittrexOrderSchema } from '../IBittrexOrderSchema'



export class BittrexOrderParser {

  static parse (params: {
    rawOrder: IBittrexOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const exchangeId = Bittrex.ID

    const {
      createdAt,
      direction,
      id,
      fillQuantity,
      marketSymbol,
      quantity,
      type: orderType,
      status,
      limit,
      closedAt,
      proceeds,
    } = rawOrder

    const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Bittrex.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Bittrex.settings.mappings,
    })

    let rate: number | undefined

    if (limit) {

      rate = parseFloat(limit)

    } else if (proceeds) {

      rate = parseFloat(proceeds)

    }

    const amount = parseFloat(quantity)
    const total = rate ? amount * rate : amount

    const orderStatus = BittrexStatusAdapter.translateToAluna({
      fillQuantity,
      quantity,
      from: status,
    })

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date(closedAt)

    }

    const isClosed = status === BittrexOrderStatusEnum.CLOSED
    const isCanceled = orderStatus === AlunaOrderStatusEnum.CANCELED
    const isPartFilled = orderStatus === AlunaOrderStatusEnum.PARTIALLY_FILLED

    if (isCanceled || (isPartFilled && isClosed)) {

      canceledAt = new Date(closedAt)

    }

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: marketSymbol,
      total,
      amount,
      rate,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: BittrexSideAdapter.translateToAluna({ from: direction }),
      status: orderStatus,
      type: BittrexOrderTypeAdapter.translateToAluna({ from: orderType }),
      placedAt: new Date(createdAt),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
