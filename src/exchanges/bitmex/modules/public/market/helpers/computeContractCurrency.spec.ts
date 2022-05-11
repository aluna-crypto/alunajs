import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeContractCurrency } from './computeContractCurrency'



describe(__filename, () => {

  it('should properly compute contract currency', () => {

    // preparing data
    const rawMarkets = cloneDeep(BITMEX_RAW_MARKETS.slice(0, 3))

    rawMarkets[0].isQuanto = true

    rawMarkets[1].isQuanto = false

    rawMarkets[1].isQuanto = false
    rawMarkets[1].isInverse = true


    // executing
    each(rawMarkets, (rawMarket) => {

      const {
        isQuanto,
        isInverse,
        rootSymbol,
        quoteCurrency,
      } = rawMarket

      let expectedContractCurrency

      if (isQuanto) {

        expectedContractCurrency = 'XBT'

      } else {

        expectedContractCurrency = isInverse
          ? quoteCurrency
          : rootSymbol

      }

      const contractCurrency = computeContractCurrency({
        rawMarket,
      })


      // validating
      expect(contractCurrency).to.be.eq(expectedContractCurrency)

    })

  })

})
