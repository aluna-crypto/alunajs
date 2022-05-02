import { expect } from 'chai'

import { IPublicParams } from '../IPublicParams'



export function market(params: IPublicParams) {

  const { exchangePublic } = params

  it('listRaw', async () => {

    const {
      rawMarkets,
      requestCount,
    } = await exchangePublic.market.listRaw()

    expect(rawMarkets).to.exist // not always an array

    expect(requestCount.public).to.be.greaterThan(0) // at lesat one request
    expect(requestCount.authed).to.be.eq(0)

  })

  it('list', async () => {

    const {
      markets,
      requestCount,
    } = await exchangePublic.market.list()

    expect(markets.length).to.be.greaterThan(0)

    expect(requestCount.public).to.be.eq(0) // must come from cache now
    expect(requestCount.authed).to.be.eq(0)

  })

}
