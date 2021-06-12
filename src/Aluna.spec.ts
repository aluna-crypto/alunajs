import { expect } from 'chai'

import { Aluna } from './Aluna'
import { Valr } from './exchanges/valr/Valr'
import { IAlunaExchange } from './lib/core/IAlunaExchange'



describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    expect(Aluna.Valr).to.be.ok

  })

  it('should properly instantiate exchange', async () => {

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

  it('should warn about exchange not implemented', async () => {

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

})
