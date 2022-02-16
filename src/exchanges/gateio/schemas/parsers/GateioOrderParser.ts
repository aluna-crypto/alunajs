import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { GateioOrderTypeAdapter } from '../../enums/adapters/GateioOrderTypeAdapter'
import { GateioSideAdapter } from '../../enums/adapters/GateioSideAdapter'
import { GateioStatusAdapter } from '../../enums/adapters/GateioStatusAdapter'
import { Gateio } from '../../Gateio'
import { IGateioOrderSchema } from '../IGateioOrderSchema'



export class GateioOrderParser {

  static parse (params: {
    rawOrder: IGateioOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const exchangeId = Gateio.ID

    const {
      id,
      type: orderType,
      status,
      amount: quantity,
      currency_pair,
      side,
      price,
      create_time_ms,
      update_time_ms,
    } = rawOrder

    const amount = parseFloat(quantity)
    const rate = parseFloat(price)
    const total = amount * rate
    const splittedMarketSymbol = currency_pair.split('_')
    const baseSymbolId = splittedMarketSymbol[0]
    const quoteSymbolId = splittedMarketSymbol[1]
    const createdAt = new Date(create_time_ms)

    const orderStatus = GateioStatusAdapter.translateToAluna({ from: status })

    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = new Date(update_time_ms)

    }

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = new Date(update_time_ms)

    }

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: currency_pair,
      total,
      amount,
      rate,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: GateioSideAdapter.translateToAluna({ from: side }),
      status: orderStatus,
      type: GateioOrderTypeAdapter.translateToAluna({ from: orderType }),
      placedAt: new Date(createdAt),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
