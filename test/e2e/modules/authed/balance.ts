import { expect } from 'chai'
import { each } from 'lodash'

import { IAuthedParams } from '../IAuthedParams'
import { isGetTradableBalanceImplemented } from './helpers/utils/isGetTradableBalanceImplemented'



export function balance(params: IAuthedParams) {

  const { exchangeAuthed } = params

  it('list', async () => {

    const {
      balances,
      requestWeight,
    } = await exchangeAuthed.balance.list()

    expect(balances).to.exist

    expect(balances.length).to.be.greaterThan(0)

    each(balances, (balance) => {

      expect(balance.available).to.exist
      expect(balance.symbolId).to.exist
      expect(balance.wallet).to.exist
      expect(balance.available).to.exist
      expect(balance.total).to.exist
      expect(balance.meta).to.exist

    })

    expect(requestWeight.authed).to.be.greaterThan(0)
    expect(requestWeight.public).to.be.eq(0)

  })

  it('listRaw', async () => {

    const {
      rawBalances,
      requestWeight,
    } = await exchangeAuthed.balance.listRaw()

    expect(rawBalances).to.exist

    expect(rawBalances.length).to.be.greaterThan(0)

    expect(requestWeight.authed).to.be.greaterThan(0)
    expect(requestWeight.public).to.be.eq(0)

  })

  if (isGetTradableBalanceImplemented(exchangeAuthed)) {

    it('getTradableBalance', () => {
      expect(exchangeAuthed).to.be.ok
    })

  }

}
