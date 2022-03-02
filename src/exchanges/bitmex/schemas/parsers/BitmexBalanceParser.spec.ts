import BigNumber from 'bignumber.js'
import { expect } from 'chai'
import {
  clone,
  each,
  filter,
} from 'lodash'

import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { mockAlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping.mock'
import { BitmexSettlementCurrencyEnum } from '../../enums/BitmexSettlementCurrencyEnum'
import { BITMEX_RAW_BALANCES } from '../../test/bitmexBalances'
import { BitmexBalanceParser } from './BitmexBalanceParser'



describe('BitmexBalanceParser', () => {


  it('should properly parse bitmex raw balances', () => {

    const translatedSymbolId = 'ETH'

    const { alunaSymbolMappingMock } = mockAlunaSymbolMapping({
      returnSymbol: translatedSymbolId,
    })

    const [usdtBalance] = filter(
      BITMEX_RAW_BALANCES,
      (raw) => raw.currency === BitmexSettlementCurrencyEnum.USDT,
    )

    const clonedBalance = clone(usdtBalance)

    clonedBalance.walletBalance = 680000000
    clonedBalance.availableMargin = 350000000

    const rawBalances = [
      ...BITMEX_RAW_BALANCES,
      clonedBalance,
    ]

    expect(rawBalances.length).to.be.eq(4)

    each(rawBalances, (rawBalance, index) => {

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

      expect(parsedBalance.symbolId).to.be.eq(translatedSymbolId)
      expect(parsedBalance.account).to.be.eq(AlunaAccountEnum.DERIVATIVES)
      expect(parsedBalance.available).to.be.eq(expectedAvailable)
      expect(parsedBalance.total).to.be.eq(expectedTotal)
      expect(parsedBalance.meta).to.deep.eq(rawBalance)

      expect(alunaSymbolMappingMock.callCount).to.be.eq(index + 1)
      expect(alunaSymbolMappingMock.args[index][0]).to.deep.eq({
        exchangeSymbolId: currency,
        symbolMappings: {},
      })

    })

  })

})
