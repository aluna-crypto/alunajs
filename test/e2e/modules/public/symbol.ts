import { expect } from 'chai'

import { IPublicParams } from '../IPublicParams'



export function symbol(params: IPublicParams) {

  const { exchangePublic } = params

  it('listRaw', async () => {

    const {
      rawSymbols,
      requestWeight,
    } = await exchangePublic.symbol.listRaw()

    expect(rawSymbols).to.exist

    if (Array.isArray(rawSymbols)) {
      expect(rawSymbols.length).to.be.greaterThan(0)
    }

    expect(requestWeight.public).to.be.greaterThan(0)
    expect(requestWeight.authed).to.be.eq(0)

  })

  it('list', async () => {

    const {
      symbols,
      requestWeight,
    } = await exchangePublic.symbol.list()

    expect(symbols.length).to.be.greaterThan(0)

    expect(requestWeight.public).to.be.eq(0)
    expect(requestWeight.authed).to.be.eq(0)

  })

}
