import { expect } from 'chai'

import { IAlunaExchangeAuthed } from '../../../../src/lib/core/IAlunaExchange'



export function order(exchange: IAlunaExchangeAuthed) {

  it('list', async () => {

    const {
      orders,
      requestCount,
    } = await exchange.order.list()

    console.log(orders)
    expect(orders).to.exist

    expect(requestCount.authed).to.be.greaterThan(1)
    expect(requestCount.public).to.be.eq(0)

  })

  it('listRaw', () => {
    expect(true).to.be.ok
  })

  it('place', () => {
    expect(true).to.be.ok
  })

  it('edit', () => {
    expect(true).to.be.ok
  })

  it('cancel', () => {
    expect(true).to.be.ok
  })

}
