import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexOrderTypeAdapter } from '../../enums/adapters/PoloniexOrderTypeAdapter'
import { PoloniexSideAdapter } from '../../enums/adapters/PoloniexSideAdapter'
import { PoloniexStatusAdapter } from '../../enums/adapters/PoloniexStatusAdapter'
import { Poloniex } from '../../Poloniex'
import { IPoloniexOrderStatusInfo } from '../IPoloniexOrderSchema'



export class PoloniexOrderParser {

  static parse (params: {
    rawOrder: IPoloniexOrderStatusInfo,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const exchangeId = Poloniex.ID

    const {
      amount,
      currencyPair,
      date,
      orderNumber,
      rate,
      total,
      type,
      status,
    } = rawOrder

    const splittedMarketSymbol = currencyPair.split('_')
    const baseSymbolId = splittedMarketSymbol[0]
    const quoteSymbolId = splittedMarketSymbol[1]

    const orderStatus = PoloniexStatusAdapter.translateToAluna({
      from: status,
    })

    const parsedOrder: IAlunaOrderSchema = {
      id: orderNumber,
      symbolPair: currencyPair,
      total: parseFloat(total),
      amount: parseFloat(amount),
      rate: parseFloat(rate),
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: PoloniexSideAdapter.translateToAluna({ from: type }),
      status: orderStatus,
      type: PoloniexOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(date),
      meta: rawOrder,
    }

    return parsedOrder

  }

}
