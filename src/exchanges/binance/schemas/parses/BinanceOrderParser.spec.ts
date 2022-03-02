import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { BinanceOrderTypeAdapter } from '../../enums/adapters/BinanceOrderTypeAdapter'
import { BinanceSideAdapter } from '../../enums/adapters/BinanceSideAdapter'
import { BinanceStatusAdapter } from '../../enums/adapters/BinanceStatusAdapter'
import { BinanceOrderStatusEnum } from '../../enums/BinanceOrderStatusEnum'
import { BINANCE_RAW_MARKETS_WITH_CURRENCY } from '../../test/fixtures/binanceMarket'
import {
  BINANCE_RAW_MARKET_ORDER,
  BINANCE_RAW_ORDER,
} from '../../test/fixtures/binanceOrder'
import { IBinanceOrderSchema } from '../IBinanceOrderSchema'
import { BinanceOrderParser } from './BinanceOrderParser'



describe('BinanceOrderParser', () => {

  const translatedSymbol = 'ETH'

  const mockDeps = () => {

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbol,
    })

    return { alunaSymbolMappingMock }

  }

  it('should parse Binance order just fine', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    const rawOriginalQuantity = parseFloat(rawOrder.origQty)
    const rawPrice = parseFloat(rawOrder.price)
    const rawSide = rawOrder.side
    const rawType = rawOrder.type
    const rawStatus = rawOrder.status

    expect(parsedOrder.id).to.be.eq(rawOrder.orderId)
    expect(parsedOrder.baseSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.quoteSymbolId).to.be.eq(translatedSymbol)
    expect(parsedOrder.symbolPair).to.be.eq(rawOrder.symbol)
    expect(parsedOrder.total).to.be.eq(rawOriginalQuantity * rawPrice)
    expect(parsedOrder.amount).to.be.eq(rawOriginalQuantity)
    expect(parsedOrder.rate).to.be.eq(rawPrice)
    expect(parsedOrder.account).to.be.eq(AlunaAccountEnum.EXCHANGE)

    expect(parsedOrder.side)
      .to.be.eq(BinanceSideAdapter.translateToAluna({ from: rawSide }))
    expect(parsedOrder.status)
      .to.be.eq(BinanceStatusAdapter.translateToAluna({ from: rawStatus }))
    expect(parsedOrder.type)
      .to.be.eq(BinanceOrderTypeAdapter.translateToAluna({ from: rawType }))
    expect(parsedOrder.placedAt.getTime())
      .to.be.eq(new Date(rawOrder.time!).getTime())

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })

  it(
    'should parse Binance order just fine without time and updateTime',
    async () => {

      const mockedDate = new Date(Date.now())

      function mockedDateConstructor () {

        return mockedDate

      }

      ImportMock.mockOther(
        global,
        'Date',
        mockedDateConstructor as any,
      )

      const { alunaSymbolMappingMock } = mockDeps()

      const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

      const { symbol: currencyPair } = rawOrder

      const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
        (rm) => rm.symbol === currencyPair,
      )

      rawOrder.time = undefined
      rawOrder.status = BinanceOrderStatusEnum.CANCELED
      rawOrder.updateTime = undefined

      const parsedOrder = BinanceOrderParser.parse({
        rawOrder,
        symbolInfo: symbolInfo!,
      })

      expect(parsedOrder.placedAt.getTime()).to.be.eq(new Date().getTime())

      expect(parsedOrder.canceledAt).to.be.eq(undefined)

      expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

    },
  )

  it('should parse Binance order just fine with transactTime', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    const transactTime = new Date().getTime()

    rawOrder.time = undefined
    rawOrder.transactTime = transactTime

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    expect(parsedOrder.placedAt).to.deep.eq(new Date(transactTime))

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

  })

  it('should parse Binance order just fine with updateTime', async () => {

    const { alunaSymbolMappingMock } = mockDeps()

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    rawOrder.time = new Date().getTime()
    rawOrder.updateTime = new Date().getTime()
    rawOrder.status = BinanceOrderStatusEnum.CANCELED

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    expect(alunaSymbolMappingMock.callCount).to.be.eq(2)
    expect(alunaSymbolMappingMock.args[0][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[1][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.quoteCurrency,
      symbolMappings: {},
    })

    const updatedAt = new Date(rawOrder.updateTime).getTime()

    expect(parsedOrder.canceledAt?.getTime()).to.be.eq(updatedAt)

    rawOrder.status = BinanceOrderStatusEnum.FILLED

    const parsedOrder2 = BinanceOrderParser.parse({
      rawOrder,
      symbolInfo: symbolInfo!,
    })

    expect(parsedOrder2.filledAt?.getTime()).to.be.eq(updatedAt)

    expect(alunaSymbolMappingMock.callCount).to.be.eq(4)
    expect(alunaSymbolMappingMock.args[2][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.baseCurrency,
      symbolMappings: {},
    })
    expect(alunaSymbolMappingMock.args[3][0]).to.deep.eq({
      exchangeSymbolId: symbolInfo!.quoteCurrency,
      symbolMappings: {},
    })

  })

  it(
    "should ensure immeditially filled orders have 'rate' and 'filledAt'",
    async () => {

      const { alunaSymbolMappingMock } = mockDeps()

      const rawOrder: IBinanceOrderSchema = BINANCE_RAW_MARKET_ORDER

      const { symbol: currencyPair } = rawOrder

      const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
        (rm) => rm.symbol === currencyPair,
      )

      const parsedOrder = BinanceOrderParser.parse({
        rawOrder,
        symbolInfo: symbolInfo!,
      })

      expect(parsedOrder.rate).to.be.eq(Number(rawOrder.fills![0].price))
      expect(parsedOrder.filledAt).to.be.ok

      expect(parsedOrder.filledAt).to.be.ok

      expect(alunaSymbolMappingMock.callCount).to.be.eq(2)

    },
  )

})
