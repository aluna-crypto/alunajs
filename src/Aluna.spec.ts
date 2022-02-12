import { expect } from 'chai'

import { Aluna } from './Aluna'
import { Bitfinex } from './exchanges/bitfinex/Bitfinex'
import { Valr } from './exchanges/valr/Valr'
import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'



describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    expect(Aluna.Valr).to.be.ok

  })

  it('should properly instantiate exchanges', async () => {

    let valr: IAlunaExchange | undefined
    let bitfinex: IAlunaExchange | undefined

    let error

    try {

      valr = Aluna.new({
        exchangeId: 'valr',
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

    } catch (err) {

      error = err

    }

    expect(error).not.to.be.ok

    expect(valr).to.be.ok
    expect(bitfinex).to.be.ok

    expect(valr instanceof Valr).to.be.ok
    expect(bitfinex instanceof Bitfinex).to.be.ok

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

  it('should properly resolve exchange static class', async () => {

    let Valr: IAlunaExchangeStatic | undefined
    let Bitfinex: IAlunaExchangeStatic | undefined

    let error

    try {

      Valr = Aluna.static({ exchangeId: 'valr' })
      Bitfinex = Aluna.static({ exchangeId: 'bitfinex' })

    } catch (err) {

      error = err as AlunaError

    }

    expect(error).not.to.be.ok

    expect(Valr).to.be.ok
    expect(Valr?.ID).to.eq('valr')

    expect(Bitfinex).to.be.ok
    expect(Bitfinex?.ID).to.eq('bitfinex')

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
