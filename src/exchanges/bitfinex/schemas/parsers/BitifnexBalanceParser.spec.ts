import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { BitfinexAccountsAdapter } from '../../enums/adapters/BitfinexAccountsAdapter'
import { BITFINEX_RAW_BALANCES } from '../../test/fixtures/bitfinexBalances'
import { BitfinexBalanceParser } from './BitifnexBalanceParser'



describe('BitfinexBalanceParser', () => {

  it('should parse Bitfinex balance just fine', async () => {

    ImportMock.mockOther(
      Bitfinex,
      'settings',
      { mappings: { UST: 'USDT' } },
    )

    const translateSymbolIdMock = ImportMock.mockFunction(
      AlunaSymbolMapping,
      'translateSymbolId',
    )

    BITFINEX_RAW_BALANCES.forEach((rawBalance, index) => {

      const expectedSymbolId = rawBalance[1]

      translateSymbolIdMock.returns(expectedSymbolId)

      const parsedBalance = BitfinexBalanceParser.parse({
        rawBalance,
      })

      const [
        walletType,
        _currency,
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
      expect(symbolId).to.be.eq(expectedSymbolId)
      expect(available).to.be.eq(availableBalance)
      expect(total).to.be.eq(balance)
      expect(meta).to.deep.eq(rawBalance)

      expect(translateSymbolIdMock.callCount).to.be.eq(index + 1)

    })

  })

})
