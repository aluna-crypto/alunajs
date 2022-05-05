import { expect } from 'chai'
import { each } from 'lodash'

import { aluna } from './aluna'
import { AlunaError } from './lib/core/AlunaError'
import {
  IAlunaExchangeAuthed,
  IAlunaExchangePublic,
} from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { exchanges } from './lib/exchanges'



describe(__filename, () => {



  it('should properly instantiate exchanges (public)', async () => {

    const exchangeIds = Object.keys(exchanges)

    expect(exchangeIds.length).to.eq(2)

    each(exchangeIds, (exchangeId) => {

      let error: AlunaError | undefined
      let exchange: IAlunaExchangePublic | undefined

      try {

        exchange = aluna(exchangeId)

      } catch (err) {

        error = err

      }

      expect(error).not.to.be.ok
      expect(exchange).to.be.ok
      expect(exchange instanceof exchanges[exchangeId].Public).to.be.ok

    })

  })



  it('should properly instantiate exchanges (authed)', async () => {

    const exchangeIds = Object.keys(exchanges)

    expect(exchangeIds.length).to.eq(2)

    each(exchangeIds, (exchangeId) => {

      let error: AlunaError | undefined
      let exchange: IAlunaExchangeAuthed | undefined

      try {

        exchange = aluna(exchangeId, { credentials: { key: '', secret: '' } })

      } catch (err) {

        error = err

      }

      expect(error).not.to.be.ok
      expect(exchange).to.be.ok
      expect(exchange instanceof exchanges[exchangeId].Authed).to.be.ok

    })

  })



  it('should warn about exchange not supported', async () => {

    const exchangeId = 'goddex'

    let error: AlunaError | undefined
    let exchange: IAlunaExchangePublic | undefined

    try {

      exchange = aluna(exchangeId)

    } catch (err) {

      error = err

    }

    expect(exchange).not.to.be.ok
    expect(error).to.be.ok

    expect(error?.code).to.be.eq(AlunaExchangeErrorCodes.NOT_SUPPORTED)
    expect(error?.message).to.be.eq(`Exchange not supported: ${exchangeId}.`)

  })



  it('should export web3 method and instance', async () => {

    const web3 = aluna.web3()

    expect(web3).to.be.ok

  })



})
