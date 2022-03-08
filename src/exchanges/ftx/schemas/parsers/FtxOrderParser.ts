import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { IAlunaOrderSchema } from '../../../../lib/schemas/IAlunaOrderSchema'
import { FtxOrderTypeAdapter } from '../../enums/adapters/FtxOrderTypeAdapter'
import { FtxSideAdapter } from '../../enums/adapters/FtxSideAdapter'
import { FtxStatusAdapter } from '../../enums/adapters/FtxStatusAdapter'
import { Ftx } from '../../Ftx'
import { IFtxOrderSchema } from '../IFtxOrderSchema'



export class FtxOrderParser {

  static parse (params: {
    rawOrder: IFtxOrderSchema,
  }): IAlunaOrderSchema {

    const { rawOrder } = params

    const exchangeId = Ftx.ID

    const {
      side,
      price,
      type,
      status,
      createdAt,
      id,
      market,
      size,
      filledSize,
      avgFillPrice,
    } = rawOrder

    const splittedSymbolPair = market.split('/')
    const baseSymbolId = splittedSymbolPair[0]
    const quoteSymbolId = splittedSymbolPair[1]

    let total = size
    let orderPrice: number | undefined

    if (price) {

      orderPrice = price
      total = size * price

    }

    if (avgFillPrice) {

      orderPrice = avgFillPrice
      total = size * avgFillPrice

    }

    const orderStatus = FtxStatusAdapter
      .translateToAluna({ from: status, size, filledSize })

    let canceledAt: Date | undefined
    let filledAt: Date | undefined

    const isCanceled = orderStatus === AlunaOrderStatusEnum.CANCELED
    const isFilled = orderStatus === AlunaOrderStatusEnum.FILLED

    if (isCanceled) {

      canceledAt = new Date()

    }

    if (isFilled) {

      filledAt = new Date()

    }


    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: market,
      total,
      amount: size,
      rate: orderPrice,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: FtxSideAdapter.translateToAluna({ from: side }),
      status: orderStatus,
      type: FtxOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(createdAt),
      canceledAt,
      filledAt,
      meta: rawOrder,
    }

    return parsedOrder

  }

}
