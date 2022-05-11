import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { cloneDeep } from 'lodash'

import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeUsdPricePerUnit } from './computeUsdPricePerUnit'



describe(__filename, () => {

  it('should properly compute USD price per unit for quanto contracts', () => {

    // preparing data
    const rawMarket = cloneDeep(BITMEX_RAW_MARKETS[0])

    rawMarket.isQuanto = true


    // executing
    const usdPricePerUnit = computeUsdPricePerUnit({
      rawMarket,
    })


    // validating
    const {
      multiplier,
      markPrice,
      quoteToSettleMultiplier,
    } = rawMarket

    const expectedUsdPricePerUnit = new BigNumber(Math.abs(multiplier))
      .times(markPrice)
      .div(quoteToSettleMultiplier || 1)
      .toNumber()

    expect(expectedUsdPricePerUnit).to.be.eq(usdPricePerUnit)

  })

})
