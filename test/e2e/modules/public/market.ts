import { expect } from 'chai'

import { IPublicParams } from '../IPublicParams'



export function market(params: IPublicParams) {

  const {
    exchangePublic,
    exchangeConfigs,
  } = params

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
    expect(markets[0].exchangeId).to.be.eq(exchangePublic.id)

    expect(requestWeight.public).to.be.greaterThan(0)
    expect(requestWeight.authed).to.be.eq(0)

  })

  if (exchangePublic.market.get) {

    const { symbolPair } = exchangeConfigs

    it('getRaw', async () => {

      const {
        rawMarket,
        requestWeight,
      } = await exchangePublic.market.getRaw!({ symbolPair })

      expect(rawMarket).to.be.ok

      expect(requestWeight.public).to.be.greaterThan(0)
      expect(requestWeight.authed).to.be.eq(0)

    })

    it('get', async () => {

      const {
        market,
        requestWeight,
      } = await exchangePublic.market.get!({ symbolPair })

      expect(market).to.be.ok
      expect(market.symbolPair).to.be.eq(symbolPair)
      expect(market.exchangeId).to.be.eq(exchangePublic.id)

      expect(requestWeight.public).to.be.greaterThan(0)
      expect(requestWeight.authed).to.be.eq(0)

    })

  }

}
