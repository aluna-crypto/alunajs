import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { FtxOrderTypeAdapter } from '../../enums/adapters/FtxOrderTypeAdapter'
import { FtxSideAdapter } from '../../enums/adapters/FtxSideAdapter'
import { FtxStatusAdapter } from '../../enums/adapters/FtxStatusAdapter'
import { FtxOrderStatusEnum } from '../../enums/FtxOrderStatusEnum'
import {
  FTX_RAW_LIMIT_ORDER,
  FTX_RAW_MARKET_ORDER,
} from '../../test/fixtures/ftxOrder'
import { IFtxOrderSchema } from '../IFtxOrderSchema'
import { FtxOrderParser } from './FtxOrderParser'



describe('FtxOrderParser', () => {

  it('should parse Ftx order just fine', async () => {

    const rawOrder: IFtxOrderSchema = FTX_RAW_LIMIT_ORDER

    const parsedOrder = FtxOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.size
    const rawPrice = rawOrder.price
    const rawSide = rawOrder.side
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status
    const rawFilledSize = rawOrder.filledSize

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.market)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice!)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(FtxSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(FtxStatusAdapter.translateToAluna(
        {
          from: rawStatus,
          size: rawOriginalQuantity,
          filledSize: rawFilledSize,
        },
      ))
    expect(parsedOrder.type)
      .to.be.eq(FtxOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

  })

  it('should parse Ftx Market order just fine', async () => {

    const rawOrder: IFtxOrderSchema = FTX_RAW_MARKET_ORDER

    rawOrder.avgFillPrice = 3
    rawOrder.filledSize = 3
    rawOrder.status = FtxOrderStatusEnum.CLOSED

    const parsedOrder = FtxOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.size
    const rawTotal = rawOrder.size * rawOrder.avgFillPrice
    const rawType = rawOrder.type

    expect(parsedOrder.total).to.be.eq(rawTotal)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(3)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder.type)
      .to.be.eq(FtxOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())
    expect(parsedOrder.filledAt).to.be.ok


    rawOrder.filledSize = 0

    const parsedOrder1 = FtxOrderParser.parse({
      rawOrder,
    })

    expect(parsedOrder1.canceledAt).to.be.ok
    expect(parsedOrder1.status).to.be.eq(AlunaOrderStatusEnum.CANCELED)


  })

})
