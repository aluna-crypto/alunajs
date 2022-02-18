import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { Bitfinex } from '../../Bitfinex'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
} from '../../test/fixtures/bitfinexSymbols'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



describe('BitfinexSymbolParser', () => {

  it('should parse bitfinex symbols just fine', async () => {

    const bitfinexMappings = ImportMock.mockOther(
      Bitfinex,
      'mappings',
    )

    bitfinexMappings.set(undefined)

    const mappings = {
      UST: 'USDT',
    }

    BITFINEX_CURRENCIES.forEach((currency) => {

      if (currency === 'UST') {

        bitfinexMappings.set(mappings)

      }

      const labelIndex = BITFINEX_CURRENCIES_LABELS.findIndex((l) => {

        return l[0] === currency

      })

      const parsedSymbol = BitfinexSymbolParser.parse({
        bitfinexCurrency: currency,
        bitfinexCurrencyLabel: BITFINEX_CURRENCIES_LABELS[labelIndex],
      })


      let expectedName: string | undefined
      let expectedSym: string | undefined

      if (BITFINEX_CURRENCIES_LABELS[labelIndex]) {

        const label = BITFINEX_CURRENCIES_LABELS[labelIndex]

        const [, name] = label

        expectedName = name

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
      })

    })

  })

})
