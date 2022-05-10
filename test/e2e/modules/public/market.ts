import { expect } from 'chai'

import { IPublicParams } from '../IPublicParams'



export function market(params: IPublicParams) {

  const { exchangePublic } = params

  it('listRaw', async () => {

    const {
      rawMarkets,
      requestWeight,
    } = await exchangePublic.market.listRaw()

    expect(rawMarkets).to.exist

    expect(requestWeight.public).to.be.greaterThan(0)
    expect(requestWeight.authed).to.be.eq(0)

  })

  it('list', async () => {

    const {
      markets,
      requestWeight,
    } = await exchangePublic.market.list()

    expect(markets.length).to.be.greaterThan(0)

    expect(requestWeight.public).to.be.eq(0)
    expect(requestWeight.authed).to.be.eq(0)

  })

}
