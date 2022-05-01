import { expect } from 'chai'

import { IAlunaExchangeAuthed } from '../../../../src/lib/core/IAlunaExchange'



export function position(exchange: IAlunaExchangeAuthed) {

  it.skip('list', async () => {

    const {
      orders,
      requestCount,
    } = await exchange.order.list()

    expect(orders).to.exist

    expect(requestCount.authed).to.be.greaterThan(1)
    expect(requestCount.public).to.be.eq(0)

  })

  it('listRaw', () => {
    expect(true).to.be.ok
  })

  it('get', () => {
    expect(true).to.be.ok
  })

  it('close', () => {
    expect(true).to.be.ok
  })

  it('setLeverage', () => {
    expect(true).to.be.ok
  })

  it('getLeverage', () => {
    expect(true).to.be.ok
  })

}
