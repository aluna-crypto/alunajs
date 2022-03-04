import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
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
    } = rawOrder

    const splittedSymbolPair = market.split('/')
    const baseSymbolId = splittedSymbolPair[0]
    const quoteSymbolId = splittedSymbolPair[1]

    const total = price ? size * price : size

    const orderStatus = FtxStatusAdapter.translateToAluna({ from: status })

    // @TODO -> Need to check partially-filled and canceled orders

    const parsedOrder: IAlunaOrderSchema = {
      id,
      symbolPair: market,
      total,
      amount: size,
      rate: price || undefined,
      exchangeId,
      baseSymbolId,
      quoteSymbolId,
      account: AlunaAccountEnum.EXCHANGE,
      side: FtxSideAdapter.translateToAluna({ from: side }),
      status: orderStatus,
      type: FtxOrderTypeAdapter.translateToAluna({ from: type }),
      placedAt: new Date(createdAt),
      meta: rawOrder,
    }

    return parsedOrder

  }

}
