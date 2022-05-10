import { expect } from 'chai'
import { each } from 'lodash'

import { BITFINEX_RAW_TICKERS } from '../../../../test/fixtures/bitfinexMarket'
import { splitSymbolPair } from './splitSymbolPair'



describe(__filename, () => {


  it('should properly split symbol pair', async () => {

    // preparing data
    const tickers = BITFINEX_RAW_TICKERS.slice(0, 2)
    tickers[0][0] = 'tBTCUSD'
    tickers[1][0] = 'tLUNA:BTC'


    each(tickers, (ticker) => {

      // executing
      const [symbolPair] = ticker

      const {
        baseSymbolId,
        quoteSymbolId,
      } = splitSymbolPair({
        symbolPair,
      })


      // validating
      let expectedBaseSymbolId: string
      let expectedQuoteSymbolId: string

      const spliter = symbolPair.indexOf(':')

      if (spliter >= 0) {

        expectedBaseSymbolId = symbolPair.slice(1, spliter)
        expectedQuoteSymbolId = symbolPair.slice(spliter + 1)

      } else {

        expectedBaseSymbolId = symbolPair.slice(1, 4)
        expectedQuoteSymbolId = symbolPair.slice(4)

      }

      expect(baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(quoteSymbolId).to.be.eq(expectedQuoteSymbolId)

    })

  })

})
