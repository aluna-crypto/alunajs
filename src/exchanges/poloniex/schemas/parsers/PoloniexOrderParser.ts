import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { PoloniexOrderSideAdapter } from '../../enums/adapters/PoloniexOrderSideAdapter'
import { PoloniexStatusAdapter } from '../../enums/adapters/PoloniexStatusAdapter'
import { Poloniex } from '../../Poloniex'
import {
  IPoloniexOrderStatusInfo,
  IPoloniexOrderWithCurrency,
} from '../IPoloniexOrderSchema'



export class PoloniexOrderParser {

  static parse (params: {
    rawOrder: IPoloniexOrderWithCurrency | IPoloniexOrderStatusInfo,
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
      startingAmount,
    } = rawOrder

    const [quoteCurrency, baseCurrency] = currencyPair.split('_')

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Poloniex.settings.mappings,
    })

    const translatedPoloniexStatus = PoloniexStatusAdapter
      .translatePoloniexStatus({
        status: (rawOrder as IPoloniexOrderStatusInfo).status,
        amount,
        startingAmount,
      })

    const orderStatus = PoloniexStatusAdapter.translateToAluna({
      from: translatedPoloniexStatus,
    })

    const orderAmount = startingAmount
      ? parseFloat(startingAmount)
      : parseFloat(amount)

    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = new Date()

    }

    let filledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date()

    }

    const parsedOrder: IAlunaOrderSchema = {
      id: orderNumber,
      symbolPair: currencyPair,
      total: parseFloat(total),
      amount: orderAmount,
      rate: parseFloat(rate),
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: PoloniexOrderSideAdapter.translateToAluna({ orderType: type }),
      status: orderStatus,
      type: PoloniexOrderSideAdapter.translateToAlunaOrderType(),
      placedAt: new Date(date),
      canceledAt,
      filledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
