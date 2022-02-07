import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { Bittrex } from '../../Bittrex'
import { BittrexOrderTypeAdapter } from '../../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexSideAdapter } from '../../enums/adapters/BittrexSideAdapter'
import { BittrexStatusAdapter } from '../../enums/adapters/BittrexStatusAdapter'
import { IBittrexMarketWithTicker } from '../IBittrexMarketSchema'
import { IBittrexOrderSchema } from '../IBittrexOrderSchema'



export class BittrexOrderParser {

  static parse (params: {
    rawOrder: IBittrexOrderSchema,
    symbolInfo: IBittrexMarketWithTicker,
  }): IAlunaOrderSchema {

    const { rawOrder, symbolInfo } = params

    const exchangeId = Bittrex.ID

    const {
      createdAt,
      direction,
      id,
      limit,
      marketSymbol,
      quantity,
      type: orderType,
      status,
    } = rawOrder

    const amount = parseFloat(quantity)
    const rate = parseFloat(limit)

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: marketSymbol,
      total: amount * rate,
      amount,
      rate,
      exchangeId,
      baseSymbolId: symbolInfo.baseCurrencySymbol,
      quoteSymbolId: symbolInfo.quoteCurrencySymbol,
      account: AlunaAccountEnum.EXCHANGE,
      side: BittrexSideAdapter.translateToAluna({ from: direction }),
      status: BittrexStatusAdapter.translateToAluna({ from: status }),
      type: BittrexOrderTypeAdapter.translateToAluna({ from: orderType }),
      placedAt: new Date(createdAt),
      meta: rawOrder,
    }

    return parsedOrder

  }

}
