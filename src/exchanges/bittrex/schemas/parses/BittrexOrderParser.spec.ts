import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BittrexOrderTypeAdapter } from '../../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexSideAdapter } from '../../enums/adapters/BittrexSideAdapter'
import { BittrexStatusAdapter } from '../../enums/adapters/BittrexStatusAdapter'
import { BITTREX_RAW_MARKETS_WITH_TICKER } from '../../test/fixtures/bittrexMarket'
import { BITTREX_RAW_ORDER } from '../../test/fixtures/bittrexOrder'
import { IBittrexOrderSchema } from '../IBittrexOrderSchema'
import { BittrexOrderParser } from './BittrexOrderParser'



describe('BittrexOrderParser', () => {

  it('should parse Bittrex order just fine', async () => {

    const rawOrder: IBittrexOrderSchema = BITTREX_RAW_ORDER

    const { marketSymbol: currencyPair } = rawOrder

    const symbolInfo = BITTREX_RAW_MARKETS_WITH_TICKER.find(
      (rm) => rm.symbol === currencyPair,
    )

    const parsedOrder = BittrexOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    const rawOriginalQuantity = rawOrder.quantity
    const rawPrice = rawOrder.limit
    const rawSide = rawOrder.direction
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.marketSymbol)
    expect(parsedOrder.total).to.be.eq(
      parseFloat(rawOriginalQuantity) * parseFloat(rawPrice),
    )
    expect(parsedOrder.amount).to.be.eq(parseFloat(rawOriginalQuantity))
    expect(parsedOrder.rate).to.be.eq(parseFloat(rawPrice))
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(BittrexSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(BittrexStatusAdapter.translateToAluna({ from: rawStatus }))
    expect(parsedOrder.type)
      .to.be.eq(BittrexOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

  })

})
