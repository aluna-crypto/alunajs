import { expect } from 'chai'
import {
  each,
  filter,
  map,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from '../../../../utils/mappings/AlunaSymbolMapping'
import { Bitfinex } from '../../Bitfinex'
import { BITFINEX_RAW_MARKETS } from '../../test/fixtures/bitfinexMarkets'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
} from '../../test/fixtures/bitfinexSymbols'
import { BitfinexSymbolParser } from './BitfinexSymbolParser'



describe('BitfinexSymbolParser', () => {

  it('should parse bitfinex symbols just fine', async () => {

    let mappings: Record<string, string> | undefined

    const translateSymbolIdMock = ImportMock.mockFunction(
      AlunaSymbolMapping,
      'translateSymbolId',
    )

    const bitfinexSettingsMock = ImportMock.mockOther(
      Bitfinex,
      'settings',
    )

    BITFINEX_CURRENCIES.forEach((currency, index) => {

      if (index % 2) {

        mappings = {
          UST: 'USDT',
        }

        bitfinexSettingsMock.set({
          mappings,
        })

      } else if (index % 3) {

        mappings = undefined

        bitfinexSettingsMock.set({
          mappings,
        })

      } else {

        mappings = undefined

        bitfinexSettingsMock.set(undefined)

      }

      const expectedSymbol = mappings
        ? mappings[currency] || currency
        : currency

      const expectedAlias = mappings
        ? mappings[currency] || undefined
        : undefined

      translateSymbolIdMock.returns(expectedSymbol)

      const labelIndex = BITFINEX_CURRENCIES_LABELS.findIndex((l) => {

        return l[0] === currency

      })

      const parsedSymbol = BitfinexSymbolParser.parse({
        bitfinexCurrency: currency,
        bitfinexCurrencyLabel: BITFINEX_CURRENCIES_LABELS[labelIndex],
      })


      let expectedName: string | undefined

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
      expect(expectedSymbol).to.be.eq(id)
      expect(name).to.be.eq(expectedName)
      expect(expectedAlias).to.be.eq(alias)
      expect(slug).not.to.be.ok
      expect(meta).to.deep.eq({
        currency,
        currencyLabel: BITFINEX_CURRENCIES_LABELS[labelIndex],
      })

      expect(translateSymbolIdMock.callCount).to.be.eq(index + 1)

    })

  })

  it('should properly split symbol pair', async () => {

    const spotOrMarginMarkets = filter(BITFINEX_RAW_MARKETS[0], (m) => {

      return !/(f|F0)/.test(m[0])

    })

    const symbolsPairs = map(spotOrMarginMarkets, (market) => market[0])

    each(symbolsPairs, (symbolPair) => {

      let expectedBaseSymbolId: string
      let expectedQuoteSymbolId: string

      const spliter = symbolPair.indexOf(':')

      if (spliter >= 0) {

        expectedBaseSymbolId = symbolPair.slice(1, spliter)
        expectedQuoteSymbolId = symbolPair.slice(spliter + 1)

      } else {

        expectedBaseSymbolId = symbolPair.slice(1, 4)
        expectedQuoteSymbolId = symbolPair.slice(4)

      }

      const {
        baseSymbolId,
        quoteSymbolId,
      } = BitfinexSymbolParser.splitSymbolPair({
        symbolPair,
      })

      expect(baseSymbolId).to.be.eq(expectedBaseSymbolId)
      expect(quoteSymbolId).to.be.eq(expectedQuoteSymbolId)

    })


  })

})
