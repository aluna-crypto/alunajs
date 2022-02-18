import { expect } from 'chai'

import { POLONIEX_RAW_SYMBOL } from '../../test/fixtures/poloniexSymbol'
import { PoloniexCurrencySymbolParser } from './PoloniexCurrencySymbolParser'



describe('PoloniexCurrencySymbolParser', () => {

  it('should parse Poloniex currency just fine', () => {

    const rawSymbols = POLONIEX_RAW_SYMBOL
    const rawSymbolSymbols = Object.keys(rawSymbols)

    const symbolWithTicker = PoloniexCurrencySymbolParser.parse({
      rawSymbols,
    })


    expect(rawSymbolSymbols.length).to.be.eq(3)

    symbolWithTicker.forEach((item, index) => {

      const {
        blockchain,
        currency,
        currencyType,
        delisted,
        depositAddress,
        disabled,
        frozen,
        hexColor,
        humanType,
        isGeofenced,
        minConf,
        name,
        txFee,
        id,
      } = item

      const currentSymbol = rawSymbolSymbols[index]

      expect(currency).to.be.eq(currentSymbol)
      expect(blockchain).to.be.eq(rawSymbols[currentSymbol].blockchain)
      expect(id).to.be.eq(rawSymbols[currentSymbol].id)
      expect(currencyType).to.be.eq(rawSymbols[currentSymbol].currencyType)
      expect(delisted).to.be.eq(
        rawSymbols[currentSymbol].delisted,
      )
      expect(depositAddress).to.be.eq(rawSymbols[currentSymbol].depositAddress)
      expect(disabled).to.be.eq(rawSymbols[currentSymbol].disabled)
      expect(frozen).to.be.eq(
        rawSymbols[currentSymbol].frozen,
      )
      expect(txFee).to.be.eq(rawSymbols[currentSymbol].txFee)
      expect(hexColor).to.be.eq(rawSymbols[currentSymbol].hexColor)
      expect(humanType).to.be.eq(rawSymbols[currentSymbol].humanType)
      expect(isGeofenced).to.be.eq(rawSymbols[currentSymbol].isGeofenced)
      expect(minConf).to.be.eq(
        rawSymbols[currentSymbol].minConf,
      )
      expect(name).to.be.eq(rawSymbols[currentSymbol].name)

    })

  })

})
