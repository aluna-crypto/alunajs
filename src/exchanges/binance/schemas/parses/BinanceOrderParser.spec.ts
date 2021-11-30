import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BinanceOrderTypeAdapter } from '../../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceSideAdapter } from '../../enums/adapters/BinanceSideAdapter'
import { BinanceStatusAdapter } from '../../enums/adapters/BinanceStatusAdapter'
import { BINANCE_RAW_ORDER } from '../../test/fixtures/binanceOrder'
import { IBinanceOrderSchema } from '../IBinanceOrderSchema'
import { BinanceOrderParser } from './BinanceOrderParser'



describe('BinanceOrderParser', () => {

  it('should parse Binance order just fine', async () => {

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = parseFloat(rawOrder.origQty)
    const rawPrice = parseFloat(rawOrder.price)
    const rawSide = rawOrder.side
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status

    expect(parsedOrder.id).to.be.eq(rawOrder.orderId)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.symbol)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.isAmountInContracts).not.to.be.ok
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(BinanceSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(BinanceStatusAdapter.translateToAluna({ from: rawStatus }))
    expect(parsedOrder.type)
      .to.be.eq(BinanceOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.time * 1000).getTime())

  })

})
