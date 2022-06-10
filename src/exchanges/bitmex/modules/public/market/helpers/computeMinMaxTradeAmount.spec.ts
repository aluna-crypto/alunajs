import { expect } from 'chai'
import { each } from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeMinMaxTradeAmount } from './computeMinMaxTradeAmount'



describe(__filename, () => {

  it('should properly compute minimun trade amount', () => {

    // executing
    each(BITMEX_RAW_MARKETS, (rawMarket) => {

      const {
        lotSize,
        maxOrderQty,
        underlyingToPositionMultiplier: multiplier,
      } = rawMarket

      const expectedMinTradeAmount = lotSize / (multiplier || 1)
      const expectedMaxTradeAmount = maxOrderQty / (multiplier || 1)

      const {
        minTradeAmount,
        maxTradeAmount,
      } = computeMinMaxTradeAmount({
        rawMarket,
      })


      // validating
      expect(minTradeAmount).to.be.eq(expectedMinTradeAmount)
      expect(maxTradeAmount).to.be.eq(expectedMaxTradeAmount)

    })

  })

})
