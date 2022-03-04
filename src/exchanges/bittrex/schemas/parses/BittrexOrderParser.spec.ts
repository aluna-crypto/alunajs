import { expect } from 'chai'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { BittrexOrderTypeAdapter } from '../../enums/adapters/BittrexOrderTypeAdapter'
import { BittrexSideAdapter } from '../../enums/adapters/BittrexSideAdapter'
import { BittrexStatusAdapter } from '../../enums/adapters/BittrexStatusAdapter'
import {
  BITTREX_RAW_LIMIT_ORDER,
  BITTREX_RAW_MARKET_ORDER,
} from '../../test/fixtures/bittrexOrder'
import { IBittrexOrderSchema } from '../IBittrexOrderSchema'
import { BittrexOrderParser } from './BittrexOrderParser'



describe('BittrexOrderParser', () => {

  it('should parse limit Bittrex order just fine', async () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const rawOrder: IBittrexOrderSchema = BITTREX_RAW_LIMIT_ORDER

    const parsedOrder = BittrexOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.quantity
    const rawPrice = rawOrder.limit
    const rawSide = rawOrder.direction
    const rawType = rawOrder.type
    const rawFillQty = rawOrder.fillQuantity
    const rawStatus = rawOrder.status
    const [baseCurrency, quoteCurrency] = rawOrder.marketSymbol.split('-')

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.marketSymbol)
    expect(parsedOrder.baseSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translatedSymbolId)
    expect(parsedOrder.total).to.be.eq(
      parseFloat(rawOriginalQuantity) * parseFloat(rawPrice),
    )
    expect(parsedOrder.amount).to.be.eq(parseFloat(rawOriginalQuantity))
    expect(parsedOrder.rate).to.be.eq(parseFloat(rawPrice))
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(BittrexSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(BittrexStatusAdapter.translateToAluna(
        {
          from: rawStatus,
          fillQuantity: rawFillQty,
          quantity: rawOriginalQuantity,
        },
      ))
    expect(parsedOrder.type)
      .to.be.eq(BittrexOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: quoteCurrency,
      symbolMappings: {},
    })

  })



  it('should parse market Bittrex order just fine', async () => {

    const rawOrder: IBittrexOrderSchema = BITTREX_RAW_MARKET_ORDER

    const parsedOrder = BittrexOrderParser.parse({
      rawOrder,
    })

    const rawOriginalQuantity = rawOrder.quantity
    const rawProceeds = rawOrder.proceeds
    const rawSide = rawOrder.direction
    const rawType = rawOrder.type
    const rawFillQty = rawOrder.fillQuantity
    const rawQty = rawOrder.quantity
    const rawStatus = rawOrder.status

    expect(parsedOrder.id).to.be.eq(rawOrder.id)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.marketSymbol)
    expect(parsedOrder.total).to.be.eq(
      parseFloat(rawOriginalQuantity) * parseFloat(rawProceeds),
    )
    expect(parsedOrder.amount).to.be.eq(parseFloat(rawOriginalQuantity))
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(BittrexSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(BittrexStatusAdapter.translateToAluna(
        { fillQuantity: rawFillQty, quantity: rawQty, from: rawStatus },
      ))
    expect(parsedOrder.type)
      .to.be.eq(BittrexOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.createdAt).getTime())

  })

  it('should parse filled Bittrex order just fine', async () => {

    const rawOrder: IBittrexOrderSchema = BITTREX_RAW_MARKET_ORDER

    rawOrder.fillQuantity = rawOrder.quantity

    const parsedOrder = BittrexOrderParser.parse({
      rawOrder,
    })

    const rawFillQty = rawOrder.fillQuantity
    const rawQty = rawOrder.quantity
    const rawClosedAt = rawOrder.closedAt
    const rawStatus = rawOrder.status

    expect(parsedOrder.status)
      .to.be.eq(BittrexStatusAdapter.translateToAluna(
        { fillQuantity: rawFillQty, quantity: rawQty, from: rawStatus },
      ))
    expect(parsedOrder.filledAt?.getTime())
      .to.be.eq(
        new Date(rawClosedAt).getTime(),
      )

  })

  it('should calculate total of bittrex order without limit and proceeds',
    async () => {

      const rawOrder: IBittrexOrderSchema = BITTREX_RAW_MARKET_ORDER

      // Without proceeds and limit
      rawOrder.proceeds = null as any

      const parsedOrder = BittrexOrderParser.parse({
        rawOrder,
      })

      const rawQty = rawOrder.quantity

      expect(parsedOrder.total).to.be.eq(parseFloat(rawQty))

    })

})
