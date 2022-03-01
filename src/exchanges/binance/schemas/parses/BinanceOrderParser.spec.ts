import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
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

  it('should parse Binance order just fine', async () => {

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolPairsDictionary: {
        [symbolInfo!.symbol]: {
          baseSymbolId: symbolInfo!.baseCurrency,
          quoteSymbolId: symbolInfo!.quoteCurrency,
        },
      },
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

  })

  it('should parse Binance order just fine without time and updateTime',
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
        symbolPairsDictionary: {
          [symbolInfo!.symbol]: {
            baseSymbolId: symbolInfo!.baseCurrency,
            quoteSymbolId: symbolInfo!.quoteCurrency,
          },
        },
      })

      expect(parsedOrder.placedAt).to.deep.eq(mockedDate)

      expect(parsedOrder.canceledAt).to.be.eq(undefined)

    })

  it('should parse Binance order just fine with transactTime', async () => {

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
      symbolPairsDictionary: {
        [symbolInfo!.symbol]: {
          baseSymbolId: symbolInfo!.baseCurrency,
          quoteSymbolId: symbolInfo!.quoteCurrency,
        },
      },
    })

    expect(parsedOrder.placedAt).to.deep.eq(new Date(transactTime))

  })

  it('should parse Binance order just fine with updateTime', async () => {

    const rawOrder: IBinanceOrderSchema = BINANCE_RAW_ORDER

    const { symbol: currencyPair } = rawOrder

    const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
      (rm) => rm.symbol === currencyPair,
    )

    rawOrder.time = new Date().getTime()
    rawOrder.updateTime = new Date().getTime()
    rawOrder.status = BinanceOrderStatusEnum.CANCELED

    const symbolPairsDictionary = {
      [symbolInfo!.symbol]: {
        baseSymbolId: symbolInfo!.baseCurrency,
        quoteSymbolId: symbolInfo!.quoteCurrency,
      },
    }

    const parsedOrder = BinanceOrderParser.parse({
      rawOrder,
      symbolPairsDictionary,
    })

    const updatedAt = new Date(rawOrder.updateTime).getTime()

    expect(parsedOrder.canceledAt?.getTime())
      .to.be.eq(updatedAt)

    rawOrder.status = BinanceOrderStatusEnum.FILLED

    const parsedOrder2 = BinanceOrderParser.parse({
      rawOrder,
      symbolPairsDictionary,
    })

    expect(parsedOrder2.filledAt?.getTime())
      .to.be.eq(updatedAt)

  })

  it(
    "should ensure immeditially filled orders have 'rate' and 'filledAt'",
    async () => {

      const rawOrder: IBinanceOrderSchema = BINANCE_RAW_MARKET_ORDER

      const { symbol: currencyPair } = rawOrder

      const symbolInfo = BINANCE_RAW_MARKETS_WITH_CURRENCY.find(
        (rm) => rm.symbol === currencyPair,
      )

      const parsedOrder = BinanceOrderParser.parse({
        rawOrder,
        symbolPairsDictionary: {
          [symbolInfo!.symbol]: {
            baseSymbolId: symbolInfo!.baseCurrency,
            quoteSymbolId: symbolInfo!.quoteCurrency,
          },
        },
      })

      expect(parsedOrder.rate).to.be.eq(Number(rawOrder.fills![0].price))
      expect(parsedOrder.filledAt).to.be.ok

      expect(parsedOrder.filledAt).to.be.ok

    },
  )

})
