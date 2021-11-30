import { expect } from 'chai'

import { Aluna } from './Aluna'
import { Binance } from './exchanges/binance/Binance'
import { Valr } from './exchanges/valr/Valr'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'



describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    expect(Aluna.Valr).to.be.ok
    expect(Aluna.Binance).to.be.ok

  })

  it('should properly instantiate Valr exchange', async () => {

    let valr: IAlunaExchange | undefined
    let error

    try {

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
    expect(valr).to.be.ok
    expect(valr instanceof Valr).to.be.ok

  })

  it('should properly instantiate Binance exchange', async () => {

    let binance: IAlunaExchange | undefined
    let error

    try {

      binance = Aluna.new({
        exchangeId: 'binance',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

    } catch (err) {

      error = err

    }

    expect(error).not.to.be.ok
    expect(binance).to.be.ok
    expect(binance instanceof Binance).to.be.ok

  })

  it('should warn about exchange not implemented (instance)', async () => {

    let god: IAlunaExchange | undefined
    let error

    try {

      god = Aluna.new({
        exchangeId: 'god',
        keySecret: {
          key: 'key',
          secret: 'secret',
        },
      })

    } catch (err) {

      error = err

    }

    expect(god).not.to.be.ok
    expect(error).to.be.ok
    expect(error.message).to.be.eq('Exchange not implemented: god')

  })

  it('should properly resolve exchange static class', async () => {

    const exchangeId = Valr.ID

    let Exchange: IAlunaExchangeStatic | undefined
    let error

    try {

      Exchange = Aluna.static({ exchangeId })

    } catch (err) {

      error = err

    }

    expect(error).not.to.be.ok

    expect(Exchange).to.be.ok
    expect(Exchange?.ID).to.eq(exchangeId)

  })

  it('should warn about exchange not implemented (static)', async () => {

    let god: IAlunaExchangeStatic | undefined
    let error

    try {

      god = Aluna.static({ exchangeId: 'god' })

    } catch (err) {

      error = err

    }

    expect(god).not.to.be.ok
    expect(error).to.be.ok
    expect(error.message).to.be.eq('Exchange not implemented: god')

  })

})
