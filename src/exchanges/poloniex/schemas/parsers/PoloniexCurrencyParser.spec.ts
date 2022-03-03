import { expect } from 'chai'

import { POLONIEX_RAW_BALANCES } from '../../test/fixtures/poloniexBalance'
import { POLONIEX_RAW_MARKET } from '../../test/fixtures/poloniexMarket'
import { POLONIEX_RAW_SYMBOL } from '../../test/fixtures/poloniexSymbol'
import { IPoloniexBalanceWithCurrency } from '../IPoloniexBalanceSchema'
import { IPoloniexMarketWithCurrency } from '../IPoloniexMarketSchema'
import { IPoloniexSymbolWithCurrency } from '../IPoloniexSymbolSchema'
import { PoloniexCurrencyParser } from './PoloniexCurrencyParser'



describe('PoloniexCurrencyParser', () => {

  it('should parse Poloniex market currency pairs just fine', () => {

    const rawMarkets = POLONIEX_RAW_MARKET
    const rawMarketSymbols = Object.keys(rawMarkets)

    const marketWithTicker = PoloniexCurrencyParser
      .parse<IPoloniexMarketWithCurrency>({
        rawInfo: rawMarkets,
      })


    expect(rawMarketSymbols.length).to.be.eq(3)

    marketWithTicker.forEach((item, index) => {

      const {
        baseCurrency,
        baseVolume,
        currencyPair,
        high24hr,
        highestBid,
        id,
        isFrozen,
        last,
        low24hr,
        lowestAsk,
        marginTradingEnabled,
        percentChange,
        postOnly,
        quoteCurrency,
        quoteVolume,
      } = item

      const currentMarketSymbol = rawMarketSymbols[index]
      const splittedMarketSymbol = currentMarketSymbol.split('_')
      const baseSymbolId = splittedMarketSymbol[0]
      const quoteSymbolId = splittedMarketSymbol[1]

      expect(baseCurrency).to.be.eq(baseSymbolId)
      expect(currencyPair).to.be.eq(currentMarketSymbol)
      expect(quoteCurrency)
        .to.be.eq(quoteSymbolId)
      expect(quoteVolume).to.be.eq(rawMarkets[currentMarketSymbol].quoteVolume)
      expect(id).to.be.eq(rawMarkets[currentMarketSymbol].id)
      expect(highestBid).to.be.eq(rawMarkets[currentMarketSymbol].highestBid)
      expect(isFrozen).to.be.eq(
        rawMarkets[currentMarketSymbol].isFrozen,
      )
      expect(last).to.be.eq(rawMarkets[currentMarketSymbol].last)
      expect(lowestAsk).to.be.eq(rawMarkets[currentMarketSymbol].lowestAsk)
      expect(marginTradingEnabled).to.be.eq(
        rawMarkets[currentMarketSymbol].marginTradingEnabled,
      )
      expect(postOnly).to.be.eq(rawMarkets[currentMarketSymbol].postOnly)
      expect(high24hr).to.be.eq(rawMarkets[currentMarketSymbol].high24hr)
      expect(low24hr).to.be.eq(rawMarkets[currentMarketSymbol].low24hr)
      expect(percentChange).to.be.eq(
        rawMarkets[currentMarketSymbol].percentChange,
      )
      expect(baseVolume).to.be.eq(rawMarkets[currentMarketSymbol].baseVolume)

    })

  })

  it('should parse Poloniex balances currency pairs just fine', () => {

    const rawBalances = POLONIEX_RAW_BALANCES
    const rawBalanceBalances = Object.keys(rawBalances)

    const balanceWithTicker = PoloniexCurrencyParser
      .parse<IPoloniexBalanceWithCurrency>({
        rawInfo: rawBalances,
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

  it('should parse Poloniex symbols currencies just fine', () => {

    const rawSymbols = POLONIEX_RAW_SYMBOL
    const rawSymbolSymbols = Object.keys(rawSymbols)

    const symbolWithTicker = PoloniexCurrencyParser
      .parse<IPoloniexSymbolWithCurrency>({
        rawInfo: rawSymbols,
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
      expect(depositAddress)
        .to.be.eq(rawSymbols[currentSymbol].depositAddress)
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
