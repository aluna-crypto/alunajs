import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { GateioOrderSideAdapter } from '../../enums/adapters/GateioOrderSideAdapter'
import { GateioOrderTypeAdapter } from '../../enums/adapters/GateioOrderTypeAdapter'
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
      left,
    } = rawOrder

    const amount = Number(quantity)
    const leftToFill = Number(left)
    const rate = Number(price)
    const total = amount * rate
    const createdAt = new Date(create_time_ms)
    const [baseCurrency, quoteCurrency] = currency_pair.split('_')

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: baseCurrency,
      symbolMappings: Gateio.settings.mappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: Gateio.settings.mappings,
    })

    const orderStatus = GateioStatusAdapter.translateToAluna(
      { from: status, leftToFill, amount },
    )

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
      side: GateioOrderSideAdapter.translateToAluna({ from: side }),
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
