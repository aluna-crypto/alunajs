import { expect } from 'chai'
import { each } from 'lodash'

import { aluna } from './Aluna'
import { AlunaError } from './lib/core/AlunaError'
import { IAlunaExchangePublic } from './lib/core/IAlunaExchange'
import { AlunaExchangeErrorCodes } from './lib/errors/AlunaExchangeErrorCodes'
import { exchanges } from './lib/Exchanges'



describe(__filename, () => {



  it('should properly instantiate all exchanges', async () => {

    const exchangeIds = Object.keys(exchanges)

    expect(exchangeIds.length).to.eq(1)

    each(exchangeIds, (exchangeId) => {

      let error: AlunaError
      let exchange: IAlunaExchangePublic

      try {

        exchange = aluna(exchangeId)

      } catch (err) {

        error = err

      }

      expect(error).not.to.be.ok
      expect(exchange).to.be.ok
      expect(exchange instanceof exchanges[exchangeId]).to.be.ok

    })

  })



  it('should warn about exchange not supported', async () => {

    const exchangeId = 'goddex'

    let error: AlunaError
    let exchange: IAlunaExchangePublic

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



})
