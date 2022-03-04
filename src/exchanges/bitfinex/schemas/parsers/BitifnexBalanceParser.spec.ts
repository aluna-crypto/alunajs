import { expect } from 'chai'

import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { BITFINEX_RAW_BALANCES } from '../../test/fixtures/bitfinexBalances'
import { BitfinexBalanceParser } from './BitifnexBalanceParser'



describe('BitfinexBalanceParser', () => {

  it('should parse Bitfinex balance just fine', async () => {

    BITFINEX_RAW_BALANCES.forEach((rawBalance) => {

      const parsedBalance = BitfinexBalanceParser.parse({
        rawBalance,
      })

      const [
        walletType,
        currency,
        balance,
        _unsettledInterest,
        availableBalance,
      ] = rawBalance

      const {
        account,
        symbolId,
        available,
        total,
        meta,
      } = parsedBalance

      const translatedAccount = BitfinexAccountsAdapter.translateToAluna({
        value: walletType,
      })

      expect(account).to.be.eq(translatedAccount)

      expect(symbolId).to.be.eq(currency)

      expect(available).to.be.eq(availableBalance)
      expect(total).to.be.eq(balance)

      expect(meta).to.deep.eq(rawBalance)

    })

  })

})