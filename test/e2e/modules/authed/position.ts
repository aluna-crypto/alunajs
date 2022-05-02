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

  it('get', async () => {
    expect(true).to.be.ok
  })

  it('close', async () => {
    expect(true).to.be.ok
  })

  it('setLeverage', async () => {
    expect(true).to.be.ok
  })

  it('getLeverage', async () => {
    expect(true).to.be.ok
  })

}
