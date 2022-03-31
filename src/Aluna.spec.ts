import { expect } from 'chai'
import {
  each,
  entries,
  keys,
  values,
} from 'lodash'

import { Aluna } from './Aluna'
import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchange,
  IAlunaExchangeStatic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { Exchanges } from './lib/Exchanges'
import { IAlunaKeySecretSchema } from './lib/schemas/IAlunaKeySecretSchema'
import { IAlunaSettingsSchema } from './lib/schemas/IAlunaSettingsSchema'



describe('Aluna', () => {

  it('should inherit from Exchanges and make them available statically', () => {

    const allExchangesNames = keys(Exchanges)

    each(allExchangesNames, (exchangeName) => {

      expect(Aluna[exchangeName]).to.be.ok

    })

  })

  it('should properly instantiate all exchanges', async () => {

    const allExchanges = entries(Exchanges)

    each(allExchanges, ([exchangeName, Exchange]) => {

      let exchange: IAlunaExchange | undefined

      let error

      try {

        exchange = Aluna.new({
          exchangeId: Exchange.ID,
          keySecret: {
            key: 'key',
            secret: 'secret',
          },
        })

      } catch (err) {

        error = err

      }

      expect(error).not.to.be.ok

      expect(exchange).to.be.ok

      expect(exchange instanceof Exchanges[exchangeName]).to.be.ok

    })

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

  it('should properly resolve exchange static classes', async () => {

    const exchangesArr = values(Exchanges)

    each(exchangesArr, (StaticExchange) => {

      const exchangeId = (<IAlunaExchangeStatic> StaticExchange).ID

      let Exchange: IAlunaExchangeStatic | undefined
      let error

      try {

        Exchange = Aluna.static({ exchangeId })

      } catch (err) {

        error = err as AlunaError

      }

      expect(error).not.to.be.ok

      expect(Exchange).to.be.ok
      expect(Exchange!.ID).to.eq(exchangeId)

    })

  })

  it(
    "should properly set Exchange settings when 'new' method is called",
    async () => {

      const affiliateCode = '123'
      const mappings = { XBT: 'BTC' }

      const exchangesArr = values(Aluna.exchanges)

      const keySecret: IAlunaKeySecretSchema = {
        key: '',
        secret: '',
      }

      const settings: IAlunaSettingsSchema = {
        affiliateCode,
        mappings,
      }

      each(exchangesArr, (Exchange: any) => {

        const exchange = Aluna.new({
          keySecret,
          exchangeId: Exchange.ID,
          settings,
        })

        expect(exchange.keySecret).to.be.eq(keySecret)

        expect(Exchange.settings.mappings).to.deep.eq(mappings)
        expect(Exchange.settings.affiliateCode).to.be.eq(affiliateCode)

        // Set static prop 'settings' to default value on static Exchange
        Exchange.setSettings({
          settings: {
            mappings: {},
          },
        })

      })

    },
  )

  it(
    "should properly set Exchange settings when 'static' method is called",
    async () => {

      const affiliateCode = '123'
      const mappings = { XBT: 'BTC' }

      const exchangesArr = values(Aluna.exchanges)

      const settings: IAlunaSettingsSchema = {
        affiliateCode,
        mappings,
      }

      each(exchangesArr, ({ ID }: any) => {

        const Exchange = Aluna.static({
          exchangeId: ID,
          settings,
        })

        expect(Exchange.settings.mappings).to.deep.eq(mappings)
        expect(Exchange.settings.affiliateCode).to.be.eq(affiliateCode)

        // Set static prop 'settings' to default value on static Exchange
        Exchange.setSettings({
          settings: {
            mappings: {},
          },
        })

      })

    },
  )

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
