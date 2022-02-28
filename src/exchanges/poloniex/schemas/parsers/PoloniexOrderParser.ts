import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { PoloniexSideAdapter } from '../../enums/adapters/PoloniexSideAdapter'
import { PoloniexStatusAdapter } from '../../enums/adapters/PoloniexStatusAdapter'
import { Poloniex } from '../../Poloniex'
import {
  IPoloniexOrderStatusInfo,
  IPoloniexOrderWithCurrency,
} from '../IPoloniexOrderSchema'



export class PoloniexOrderParser {

  static parse (params: {
    rawOrder: IPoloniexOrderWithCurrency | IPoloniexOrderStatusInfo,
    isFilled?: boolean,
  }): IAlunaOrderSchema {

    const { rawOrder, isFilled = false } = params

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

    const splittedMarketSymbol = currencyPair.split('_')
    const baseSymbolId = splittedMarketSymbol[0]
    const quoteSymbolId = splittedMarketSymbol[1]

    const translatedPoloniexStatus = PoloniexStatusAdapter
      .translatePoloniexStatus({
        status: (rawOrder as IPoloniexOrderStatusInfo).status,
        amount,
        startingAmount,
        isFilled,
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
      side: PoloniexSideAdapter.translateToAluna({ orderType: type }),
      status: orderStatus,
      type: PoloniexSideAdapter.translateToAlunaOrderType(),
      placedAt: new Date(date),
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
