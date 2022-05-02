import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'



export function position(params: IAuthedParams) {

  const {
    exchangeAuthed,
    // exchangeConfigs,
  } = params

  it('list', async () => {

    const {
      orders,
      requestCount,
    } = await exchangeAuthed.order.list()

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
