import { expect } from 'chai'
import {
  each,
  keys,
  values,
} from 'lodash'

import { Aluna } from './Aluna'
import { Binance } from './exchanges/binance/Binance'
import { Bitfinex } from './exchanges/bitfinex/Bitfinex'
import { Bitmex } from './exchanges/bitmex/Bitmex'
import { Bittrex } from './exchanges/bittrex/Bittrex'
import { Gateio } from './exchanges/gateio/Gateio'
import { Poloniex } from './exchanges/poloniex/Poloniex'
import { Valr } from './exchanges/valr/Valr'
import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { Exchanges } from './lib/Exchanges'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    const allExchangesNames = keys(Exchanges)

    each(allExchangesNames, (exchangeName) => {

      expect(Aluna[exchangeName]).to.be.ok

    })

  })

  it('should properly instantiate exchanges', async () => {

    let gateio: IAlunaExchange | undefined
    let binance: IAlunaExchange | undefined
    let bitfinex: IAlunaExchange | undefined
    let bitmex: IAlunaExchange | undefined
    let bittrex: IAlunaExchange | undefined
    let valr: IAlunaExchange | undefined
    let poloniex: IAlunaExchange | undefined

    let error

    try {

      gateio = Aluna.new({
        exchangeId: 'gateio',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      binance = Aluna.new({
        exchangeId: 'binance',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      bitfinex = Aluna.new({
        exchangeId: 'bitfinex',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      bitmex = Aluna.new({
        exchangeId: 'bitmex',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      bittrex = Aluna.new({
        exchangeId: 'bittrex',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      valr = Aluna.new({
        exchangeId: 'valr',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

      poloniex = Aluna.new({
        exchangeId: 'poloniex',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

    } catch (err) {

      error = err

    }

    expect(error).not.to.be.ok

    expect(gateio).to.be.ok
    expect(binance).to.be.ok
    expect(bitfinex).to.be.ok
    expect(bitmex).to.be.ok
    expect(bittrex).to.be.ok
    expect(valr).to.be.ok
    expect(poloniex).to.be.ok

    expect(gateio instanceof Gateio).to.be.ok
    expect(binance instanceof Binance).to.be.ok
    expect(bitfinex instanceof Bitfinex).to.be.ok
    expect(bitmex instanceof Bitmex).to.be.ok
    expect(bittrex instanceof Bittrex).to.be.ok
    expect(valr instanceof Valr).to.be.ok
    expect(poloniex instanceof Poloniex).to.be.ok

  })

  it('should warn about exchange not supported (instance)', async () => {

    let god: IAlunaExchange | undefined
    let error: AlunaError | undefined

    try {

      god = Aluna.new({
        exchangeId: 'god',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

    } catch (err) {

      error = err as AlunaError

    }

    expect(god).not.to.be.ok
    expect(error).to.be.ok

    expect(error?.code).to.be.eq(AlunaExchangeErrorCodes.NOT_SUPPORTED)
    expect(error?.message).to.be.eq('Exchange not supported: god')

  })

  it('should properly resolve exchange Binance static class', async () => {

    const exchangeId = Binance.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Bitfinex static class', async () => {

    const exchangeId = Bitfinex.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Bittrex static class', async () => {

    const exchangeId = Bittrex.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Valr static class', async () => {

    const exchangeId = Valr.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Gateio static class', async () => {

    const exchangeId = Gateio.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Bitmex static class', async () => {

    const exchangeId = Bitmex.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly resolve exchange Poloniex static class', async () => {

    const exchangeId = Poloniex.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should properly set settings for exchange static class', async () => {

    const referralCode = '123'
    const mappings = { XBT: 'BTC' }

    const exchangesArr = values(Aluna.exchanges)

    const settings: IAlunaSettingsSchema = {
      referralCode,
      mappings,
    }

    each(exchangesArr, ({ ID }: any) => {

      const Exchange = Aluna.static({
        exchangeId: ID,
        settings,
      })

      expect(Exchange.settings.mappings).to.deep.eq(mappings)
      expect(Exchange.settings.referralCode).to.be.eq(referralCode)

      // Set static prop 'settings' to default value on static Exchange
      Exchange.setSettings({
        settings: {
          mappings: {},
        },
      })

    })

  })

  it('should warn about exchange not supported (static)', async () => {

    let god: IAlunaExchangeStatic | undefined
    let error

    try {

      god = Aluna.static({ exchangeId: 'god' })

    } catch (err) {

      error = err as AlunaError

    }

    expect(god).not.to.be.ok
    expect(error).to.be.ok

    expect(error?.code).to.eq(AlunaExchangeErrorCodes.NOT_SUPPORTED)
    expect(error?.message).to.be.eq('Exchange not supported: god')

  })

})
