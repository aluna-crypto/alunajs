import { expect } from 'chai'

import { POLONIEX_RAW_BALANCES } from '../../test/fixtures/poloniexBalance'
import { PoloniexCurrencyBalanceParser } from './PoloniexCurrencyBalanceParser'



describe('PoloniexCurrencyBalanceParser', () => {

  it('should parse Poloniex currency balances just fine', () => {

    const rawBalances = POLONIEX_RAW_BALANCES
    const rawBalanceBalances = Object.keys(rawBalances)

    const balanceWithTicker = PoloniexCurrencyBalanceParser.parse({
      rawBalances,
    })


    expect(rawBalanceBalances.length).to.be.eq(3)

    balanceWithTicker.forEach((item, index) => {

      const {
        currency,
        available,
        onOrders,
        btcValue,
      } = item

      const currentBalance = rawBalanceBalances[index]

      expect(currency).to.be.eq(currentBalance)
      expect(available).to.be.eq(rawBalances[currentBalance].available)
      expect(btcValue).to.be.eq(rawBalances[currentBalance].btcValue)
      expect(onOrders).to.be.eq(rawBalances[currentBalance].onOrders)

    })

  })

})
