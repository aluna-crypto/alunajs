import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'



export function order(params: IAuthedParams) {

  const { exchangeAuthed } = params

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
