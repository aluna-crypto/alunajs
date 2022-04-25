import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { OkxOrderSideAdapter } from '../../enums/adapters/OkxOrderSideAdapter'
import { OkxOrderTypeAdapter } from '../../enums/adapters/OkxOrderTypeAdapter'
import { OkxStatusAdapter } from '../../enums/adapters/OkxStatusAdapter'
import { Okx } from '../../Okx'
import { IOkxOrderSchema } from '../IOkxOrderSchema'



export class OkxOrderParser {

  static parse (params: {
    rawOrder: IOkxOrderSchema,
  }): IAlunaOrderSchema {

    const {
      rawOrder,
    } = params

    const exchangeId = Okx.ID

    const {
      side,
      cTime,
      instId,
      ordId,
      px,
      state,
      sz,
      uTime,
      ordType,
      ccy,
      tgtCcy,
    } = rawOrder

    const symbolMappings = Okx.settings.mappings

    const baseSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: ccy,
      symbolMappings,
    })

    const quoteSymbolId = AlunaSymbolMapping.translateSymbolId({
      exchangeSymbolId: tgtCcy,
      symbolMappings,
    })

    const updatedAt = uTime ? new Date(Number(uTime)) : undefined
    const amount = parseFloat(sz)
    const rate = parseFloat(px)

    const orderStatus = OkxStatusAdapter.translateToAluna({ from: state })

    let createdAt: Date
    let filledAt: Date | undefined
    let canceledAt: Date | undefined

    if (cTime) {

      createdAt = new Date(Number(cTime))

    } else {

      createdAt = new Date()

    }

    if (orderStatus === AlunaOrderStatusEnum.CANCELED) {

      canceledAt = updatedAt

    }

    if (orderStatus === AlunaOrderStatusEnum.FILLED) {

      filledAt = updatedAt

    }

    const parsedOrder: IAlunaOrderSchema = {
      id: ordId,
      symbolPair: instId,
      total: amount * rate,
      amount,
      rate,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: OkxOrderSideAdapter.translateToAluna({ from: side }),
      status: orderStatus,
      type: OkxOrderTypeAdapter.translateToAluna({ from: ordType }),
      placedAt: new Date(createdAt),
      filledAt,
      canceledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
