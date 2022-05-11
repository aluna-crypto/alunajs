import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { BitmexSettlementCurrencyEnum } from '../../../../enums/BitmexSettlementCurrencyEnum'
import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import { computeContractValue } from './computeContractValue'



describe(__filename, () => {

  it('should properly compute contract value', () => {

    // preparing data
    const rawMarkets = cloneDeep(BITMEX_RAW_MARKETS.slice(0, 3))

    rawMarkets[0].settlCurrency = BitmexSettlementCurrencyEnum.BTC
    rawMarkets[0].isQuanto = true

    rawMarkets[1].settlCurrency = BitmexSettlementCurrencyEnum.BTC
    rawMarkets[1].isQuanto = false

    rawMarkets[2].settlCurrency = BitmexSettlementCurrencyEnum.USDT


    // executing
    each(rawMarkets, (rawMarket) => {

      const {
        isQuanto,
        markPrice,
        multiplier,
        settlCurrency,
      } = rawMarket

      let expectedContractValue = 0

      const absoluteMultiplier = Math.abs(Number(multiplier))

      if (settlCurrency === BitmexSettlementCurrencyEnum.BTC) {

        expectedContractValue = new BigNumber(absoluteMultiplier)
          .times(10 ** -8)
          .toNumber()

        if (isQuanto) {

          expectedContractValue = new BigNumber(expectedContractValue)
            .times(markPrice)
            .toNumber()

        }

      } else {

        expectedContractValue = new BigNumber(absoluteMultiplier)
          .times(10 ** -6)
          .toNumber()

      }

      const contractValue = computeContractValue({
        rawMarket,
      })


      // validating
      expect(contractValue).to.be.eq(expectedContractValue)

    })

  })

})
