import { expect } from 'chai'

import { BinanceSymbolStatusEnum } from '../../enums/BinanceSymbolStatusEnum'
import {
  BINANCE_RAW_MARKETS,
} from '../../test/fixtures/binanceMarket'
import {
  BINANCE_RAW_SYMBOLS,
} from '../../test/fixtures/binanceSymbols'
import { IBinanceSymbolSchema } from '../IBinanceSymbolSchema'
import { BinanceMarketFilter } from './BinanceMarketFilter'



describe('BinanceMarketFilter', () => {

  it('should filter Binance active markets just fine', () => {

    const rawSymbols = BINANCE_RAW_SYMBOLS
    const rawMarkets = BINANCE_RAW_MARKETS

    rawSymbols[0].status = BinanceSymbolStatusEnum.BREAK

    const filteredMarkets = BinanceMarketFilter.filter({
      rawSymbols,
      rawMarkets,
    })

    expect(rawSymbols.length).to.be.eq(4)
    expect(rawMarkets.length).to.be.eq(3)
    expect(filteredMarkets.length).to.be.eq(2)

    const symbolDictionary:
    { [key:string]: IBinanceSymbolSchema } = {}

    rawSymbols.forEach((pair) => {

      const { symbol } = pair

      symbolDictionary[symbol] = pair

    })

    filteredMarkets.forEach((item) => {

      const {
        symbol,
      } = item

      const rawMarket = symbolDictionary[symbol]

      expect(rawMarket).to.be.ok
      expect(rawMarket.status).to.be.eq(BinanceSymbolStatusEnum.TRADING)

    })

  })

})
