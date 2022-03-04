import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { FtxOrderTypeAdapter } from '../../enums/adapters/FtxOrderTypeAdapter'
import { FtxSideAdapter } from '../../enums/adapters/FtxSideAdapter'
import { FtxStatusAdapter } from '../../enums/adapters/FtxStatusAdapter'
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
        },
      ))
    expect(parsedOrder.type)
      .to.be.eq(FtxOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

  })

  it('should parse Ftx Market order just fine', async () => {

    const rawOrder: IFtxOrderSchema = FTX_RAW_MARKET_ORDER

    const parsedOrder = FtxOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.size
    const rawType = rawOrder.type

    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(undefined)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)
    expect(parsedOrder.type)
      .to.be.eq(FtxOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

  })

})
