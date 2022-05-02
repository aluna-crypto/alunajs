import { expect } from 'chai'

import { IPublicParams } from '../IPublicParams'



export function symbol(params: IPublicParams) {

  const { exchangePublic } = params

  it('listRaw', async () => {

    const {
      rawSymbols,
      requestCount,
    } = await exchangePublic.symbol.listRaw()

    expect(rawSymbols).to.exist
    expect(rawSymbols.length).to.be.greaterThan(0)

    expect(requestCount.public).to.be.greaterThan(0)
    expect(requestCount.authed).to.be.eq(0)

  })

  it('list', async () => {

    const {
      symbols,
      requestCount,
    } = await exchangePublic.symbol.list()

    expect(symbols.length).to.be.greaterThan(0)

    expect(requestCount.public).to.be.eq(0)
    expect(requestCount.authed).to.be.eq(0)

  })

}
