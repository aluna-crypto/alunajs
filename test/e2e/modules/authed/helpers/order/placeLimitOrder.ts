import { IAlunaExchangeAuthed } from '../../../../../../src/lib/core/IAlunaExchange'



export const placeLimitOrder = async (params: {
  exchangeAuthed: IAlunaExchangeAuthed
}) => {

  const { exchangeAuthed } = params

  return exchangeAuthed.order.place({
    ...params,
    // ...
  } as any)

}
