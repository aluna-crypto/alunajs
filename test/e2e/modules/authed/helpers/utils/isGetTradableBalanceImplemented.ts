import { expect } from 'chai'

import { IAlunaExchangeAuthed } from '../../../../../../src/lib/core/IAlunaExchange'



export const isGetTradableBalanceImplemented = (
  exchangeAuthed: IAlunaExchangeAuthed,
): boolean => {

  const {
    id,
    balance,
  } = exchangeAuthed

  if (balance.getTradableBalance) {

    return true

  }

  it.skip(`'getTradableBalance' not implemented for ${id}`,
    async () => expect(1).to.be.ok)

  return false

}
