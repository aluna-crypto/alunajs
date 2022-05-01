import { expect } from 'chai'

import { IAlunaExchangeAuthed, IAlunaExchangePublic } from '../../../../src/lib/core/IAlunaExchange'



export function key(exchange: IAlunaExchangeAuthed) {

  it('fetchDetails', async () => {

    const {
      key,
      requestCount,
    } = await exchange.key.fetchDetails()

    expect(key).to.exist
    // expect(key.accountId).to.exist // <— not always present

    expect(key.permissions).to.exist
    expect(key.permissions.read).to.exist
    expect(key.permissions.withdraw).to.exist
    expect(key.permissions.trade).to.exist

    expect(key.meta).to.exist

    expect(requestCount.authed).to.be.greaterThan(1) // at least one
    expect(requestCount.public).to.be.eq(0) // never called

  })

}
