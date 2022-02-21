import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { BITMEX_RAW_BALANCES } from '../../test/bitmexBalances'
import { BitmexBalanceParser } from './BitmexBalanceParser'



describe('BitmexBalanceParser', () => {


  it('should properly parse BitMEX raw balances', () => {

    each(BITMEX_RAW_BALANCES, (rawBalance) => {

      const {
        currency,
        walletBalance,
        availableMargin,
      } = rawBalance

      let expectedAvailable: number
      let expectedTotal: number

      if (walletBalance <= 0) {

        expectedAvailable = 0
        expectedTotal = 0

      } else {

        let multiplier: number

        switch (currency) {

          case (BitmexSettlementCurrencyEnum.BTC):

            multiplier = 10 ** -8

            break

          case (BitmexSettlementCurrencyEnum.USDT):

            multiplier = 10 ** -6

            break

          default:

            multiplier = 1

        }

        expectedAvailable = new BigNumber(availableMargin)
          .times(multiplier)
          .toNumber()

        expectedTotal = new BigNumber(walletBalance)
          .times(multiplier)
          .toNumber()

      }

      const parsedBalance = BitmexBalanceParser.parse({ rawBalance })

      expect(parsedBalance.symbolId).to.be.eq(currency)
      expect(parsedBalance.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(parsedBalance.available).to.be.eq(expectedAvailable)
      expect(parsedBalance.total).to.be.eq(expectedTotal)
      expect(parsedBalance.meta).to.deep.eq(rawBalance)

    })

  })

})
