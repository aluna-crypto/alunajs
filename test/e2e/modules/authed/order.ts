import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'
import { placeLimitOrder } from './helpers/order/placeLimitOrder'



export function order(params: IAuthedParams) {

  const { exchangeAuthed } = params

  /**
   * Limit Orders
   */
  describe('type:limit', () => {

    it('place', async () => {
      await placeLimitOrder({ exchangeAuthed })
      expect(true).to.be.ok
    })

    it('list', () => {
      // at least one order
      expect(true).to.be.ok
    })

    it('get', () => {
      // validate values
      expect(true).to.be.ok
    })

    it('edit', () => {
      expect(true).to.be.ok
    })

    it('get', () => {
      // status = must be open
      // values shoulb be the edited ones
      expect(true).to.be.ok
    })

    it('cancel', () => {
      expect(true).to.be.ok
    })

    it('get', () => {
      // status = must be canceled
      expect(true).to.be.ok
    })

  })

  it('list', async () => {

    const {
      orders,
      requestCount,
    } = await exchangeAuthed.order.list()

    expect(orders).to.exist

    expect(requestCount.authed).to.be.greaterThan(0)
    expect(requestCount.public).to.be.eq(0)

  })

  it('listRaw', () => {
    expect(true).to.be.ok
  })


  it('edit', () => {
    expect(true).to.be.ok
  })

  it('cancel', () => {
    expect(true).to.be.ok
  })

}
