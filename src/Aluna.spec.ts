import { expect } from 'chai'

import { Aluna } from './Aluna'
import { Binance } from './exchanges/binance/Binance'
import { Bitfinex } from './exchanges/bitfinex/Bitfinex'
import { Bitmex } from './exchanges/bitmex/Bitmex'
import { Bittrex } from './exchanges/bittrex/Bittrex'
import { Gateio } from './exchanges/gateio/Gateio'
import { Valr } from './exchanges/valr/Valr'
import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'



// TODO: Refatory file and tests to work with all exchanges automatically

describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    expect(Aluna.Binance).to.be.ok
    expect(Aluna.Bitfinex).to.be.ok
    expect(Aluna.Bitmex).to.be.ok
    expect(Aluna.Bittrex).to.be.ok
    expect(Aluna.Gateio).to.be.ok
    expect(Aluna.Valr).to.be.ok

  })

  it('should properly instantiate exchanges', async () => {

    let gateio: IAlunaExchange | undefined
    let binance: IAlunaExchange | undefined
    let bitfinex: IAlunaExchange | undefined
    let bitmex: IAlunaExchange | undefined
    let bittrex: IAlunaExchange | undefined
    let valr: IAlunaExchange | undefined

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

    expect(gateio instanceof Gateio).to.be.ok
    expect(binance instanceof Binance).to.be.ok
    expect(bitfinex instanceof Bitfinex).to.be.ok
    expect(bitmex instanceof Bitmex).to.be.ok
    expect(bittrex instanceof Bittrex).to.be.ok
    expect(valr instanceof Valr).to.be.ok

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
