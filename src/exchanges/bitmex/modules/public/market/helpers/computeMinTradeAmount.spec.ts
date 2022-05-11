import { expect } from 'chai'
import { each } from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeMinTradeAmount } from './computeMinTradeAmount'



describe(__filename, () => {

  it('should properly compute minimun trade amount', () => {

    // executing
    each(BITMEX_RAW_MARKETS, (rawMarket) => {

      const {
        lotSize,
        underlyingToPositionMultiplier: multiplier,
      } = rawMarket

      const expectedMinTradeAmount = Number(lotSize) / (multiplier || 1)

      const minTradeAmount = computeMinTradeAmount({
        rawMarket,
      })


      // validating
      expect(minTradeAmount).to.be.eq(expectedMinTradeAmount)

    })

  })

})
