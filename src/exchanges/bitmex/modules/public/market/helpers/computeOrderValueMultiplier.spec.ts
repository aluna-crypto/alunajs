import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeOrderValueMultiplier } from './computeOrderValueMultiplier'



describe(__filename, () => {

  it('should properly compute order value multiplier', () => {

    // preparing data
    const rawMarkets = cloneDeep(BITMEX_RAW_MARKETS.slice(0, 3))

    rawMarkets[0].isQuanto = true

    rawMarkets[1].isQuanto = false
    rawMarkets[1].isInverse = true

    rawMarkets[2].isQuanto = false
    rawMarkets[2].isInverse = false


    // executing
    each(rawMarkets, (rawMarket) => {

      const orderValueMultiplier = computeOrderValueMultiplier({
        rawMarket,
      })


      // validating
      let expectedMultiplier: number | undefined

      const {
        maxPrice,
        isInverse,
        multiplier,
        isQuanto,
      } = rawMarket

      const fixedMultiplier = multiplier.toString().replace(/0+/, '')

      if (isQuanto) {

        expectedMultiplier = (1 / Math.abs(maxPrice)) * Number(fixedMultiplier)

      } else if (!isInverse) {

        expectedMultiplier = 1

      }

      expect(orderValueMultiplier).to.be.eq(expectedMultiplier)

    })

  })

})
