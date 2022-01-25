import { expect } from 'chai'

import { Bitfinex } from '../../Bitfinex'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
  BITFINEX_CURRENCIES_SYMS,
} from '../../test/fixtures/bitfinexSymbols'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



describe('BitfinexSymbolParser', () => {

  it('should parse bitfinex symbols just fine', async () => {

    BITFINEX_CURRENCIES[0].forEach((currency) => {

      const labelIndex = BITFINEX_CURRENCIES_LABELS.findIndex((l) => {

        return l[0] === currency

      })

      const symIndex = BITFINEX_CURRENCIES_SYMS.findIndex((s) => {

        return s[0] === currency

      })

      const parsedSymbol = BitfinexSymbolParser.parse({
        bitfinexCurrency: currency,
        bitfinexCurrencyLabel: BITFINEX_CURRENCIES_LABELS[labelIndex],
        bitfinexSym: BITFINEX_CURRENCIES_SYMS[symIndex],
      })


      let expectedName: string | undefined
      let expectedSym: string | undefined

      if (BITFINEX_CURRENCIES_LABELS[labelIndex]) {

        const label = BITFINEX_CURRENCIES_LABELS[labelIndex]

        const [, name] = label

        expectedName = name

      }

      if (BITFINEX_CURRENCIES_SYMS[symIndex]) {

        const sym = BITFINEX_CURRENCIES_SYMS[symIndex]

        const [, symbolId] = sym

        expectedSym = symbolId

      }

      const {
        id,
        name,
        exchangeId,
        alias,
        meta,
        slug,
      } = parsedSymbol

      expect(exchangeId).to.be.eq(Bitfinex.ID)
      expect(name).to.be.eq(expectedName)

      if (alias) {

        expect(id).to.be.eq(expectedSym?.toUpperCase())
        expect(alias).to.be.eq(currency)

      } else {

        expect(expectedSym).not.to.be.ok
        expect(alias).not.to.be.ok

      }

      expect(slug).not.to.be.ok
      expect(meta).to.deep.eq({
        currency,
        currencyLabel: BITFINEX_CURRENCIES_LABELS[labelIndex],
        currencySym: BITFINEX_CURRENCIES_SYMS[symIndex],
      })

    })

  })

})
