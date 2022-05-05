import { expect } from 'chai'
import { find } from 'lodash'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { bitfinexBaseSpecs } from '../../../bitfinexSpecs'
import {
  IBitfinexSymbolSchema,
  TBitfinexCurrencyPair,
} from '../../../schemas/IBitfinexSymbolSchema'
import {
  BITFINEX_CURRENCIES,
  BITFINEX_CURRENCIES_LABELS,
} from '../../../test/fixtures/bitfinexSymbols'



describe(__filename, () => {

  it(
    'should parse a Bitfinex symbol just fine (w/ alias & name)',
    async () => {

      // preparing data
      let currencyName: TBitfinexCurrencyPair | undefined

      const currency = find(BITFINEX_CURRENCIES, (symbol) => {

        currencyName = find(BITFINEX_CURRENCIES_LABELS, ([s]) => s === symbol)

        return !!currencyName

      })!

      const rawSymbol: IBitfinexSymbolSchema = {
        currency,
        currencyName,
      }

      const translatedSymbolId = 'XBT'


      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()

      translateSymbolId.returns(translatedSymbolId)


      // executing
      const exchange = new Bitfinex({})


      const { symbol } = exchange.symbol.parse({ rawSymbol })


      // validating
      expect(symbol.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
      expect(symbol.id).to.be.eq(translatedSymbolId)
      expect(symbol.name).to.be.eq(rawSymbol.currencyName?.[1])
      expect(symbol.alias).to.be.eq(rawSymbol.currency) // should be equal
      expect(symbol.meta).to.be.eq(rawSymbol)

      expect(translateSymbolId.callCount).to.be.eq(1)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: rawSymbol.currency,
        symbolMappings: undefined,
      })

    },
  )

  it(
    'should parse a Bitfinex symbol just fine (w/o alias & name)',
    async () => {

      // preparing data
      const currency = BITFINEX_CURRENCIES[0]

      const currencyName = undefined

      const rawSymbol: IBitfinexSymbolSchema = {
        currency,
        currencyName,
      }



      // mocking
      const { translateSymbolId } = mockTranslateSymbolId()
      translateSymbolId.returns(currency)


      // executing
      const exchange = new Bitfinex({})


      const { symbol } = exchange.symbol.parse({ rawSymbol })


      // validating
      expect(symbol.exchangeId).to.be.eq(bitfinexBaseSpecs.id)
      expect(symbol.id).to.be.eq(currency)
      expect(symbol.name).to.be.eq(rawSymbol.currencyName?.[1])
      expect(symbol.alias).not.to.be.ok
      expect(symbol.meta).to.be.eq(rawSymbol)

      expect(translateSymbolId.callCount).to.be.eq(1)
      expect(translateSymbolId.firstCall.args[0]).to.deep.eq({
        exchangeSymbolId: rawSymbol.currency,
        symbolMappings: undefined,
      })

    },
  )

})
