import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { resolveSymbolsIds } from './resolveSymbolsIds'



describe(__filename, () => {

  it('should properly resolve instrument symbols ids', () => {

    // preparing data
    const rawMarkets = cloneDeep(BITMEX_RAW_MARKETS.slice(0, 3))

    rawMarkets[0].isQuanto = true

    rawMarkets[1].isQuanto = false
    rawMarkets[1].isInverse = true

    rawMarkets[2].isQuanto = false
    rawMarkets[2].isInverse = false


    // executing
    each(rawMarkets, (rawMarket) => {

      const {
        isQuanto,
        isInverse,
        settlCurrency,
        quoteCurrency,
        positionCurrency,
      } = rawMarket

      let expectedAmountSymbolId: string

      if (isQuanto) {

        expectedAmountSymbolId = 'Cont'

      } else if (isInverse) {

        expectedAmountSymbolId = quoteCurrency

      } else {

        expectedAmountSymbolId = positionCurrency

      }

      const expectedRateSymbolId = quoteCurrency

      const expectedTotalSymbolId = settlCurrency.toUpperCase()

      const {
        amountSymbolId,
        rateSymbolId,
        totalSymbolId,
      } = resolveSymbolsIds({
        rawMarket,
      })


      // validating
      expect(amountSymbolId).to.be.eq(expectedAmountSymbolId)
      expect(rateSymbolId).to.be.eq(expectedRateSymbolId)
      expect(totalSymbolId).to.be.eq(expectedTotalSymbolId)

    })

  })

})
