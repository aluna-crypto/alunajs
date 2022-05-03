import { IAlunaExchangeAuthed } from '../../../../../../src/lib/core/IAlunaExchange'



export const isGetTradableBalanceImplemented = (
  exchangeAuthed: IAlunaExchangeAuthed,
): boolean => {

  const {
    balance,
  } = exchangeAuthed

  return !!balance.getTradableBalance

}
