import { expect } from 'chai'

import { IAlunaExchangePublic } from '../../../../src/lib/core/IAlunaExchange'



export function market(exchange: IAlunaExchangePublic) {

  it('listRaw', async () => {

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()

    expect(rawMarkets).to.exist // not always an array

    expect(requestCount.public).to.be.greaterThan(0) // at lesat one request
    expect(requestCount.authed).to.be.eq(0)

  })

  it('list', async () => {

    const {
      markets,
      requestCount,
    } = await exchange.market.list()

    expect(markets.length).to.be.greaterThan(0)

    expect(requestCount.public).to.be.eq(0) // must come from cache now
    expect(requestCount.authed).to.be.eq(0)

  })

}
