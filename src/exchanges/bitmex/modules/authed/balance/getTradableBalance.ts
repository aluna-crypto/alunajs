import BigNumber from 'bignumber.js'
import { debug } from 'debug'
import { find } from 'lodash'

import { IAlunaExchangeAuthed } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaBalanceGetTradableBalanceParams,
  IAlunaBalanceGetTradableBalanceReturns,
} from '../../../../../lib/modules/authed/IAlunaBalanceModule'
import { translateSymbolId } from '../../../../../utils/mappings/translateSymbolId'
import { BitmexHttp } from '../../../BitmexHttp'



const log = debug('alunajs:bitmex/balance/getTradableBalance')



export const getTradableBalance = (exchange: IAlunaExchangeAuthed) => async (
  params: IAlunaBalanceGetTradableBalanceParams,
): Promise<IAlunaBalanceGetTradableBalanceReturns> => {

  log('getting tradable balance', params)

  const {
    settings,
  } = exchange

  const {
    symbolPair,
    http = new BitmexHttp(settings),
  } = params

  const { requestWeight } = http

  const { market } = await exchange.market.get!({ symbolPair })

  const { totalSymbolId } = market.instrument!

  const translatedCurrency = translateSymbolId({
    exchangeSymbolId: totalSymbolId,
    symbolMappings: exchange.settings.symbolMappings,
  })

  const { balances } = await exchange.balance.list()

  const desiredAsset = find(balances, ({ symbolId }) => {

    return symbolId === translatedCurrency

  })

  if (!desiredAsset) {

    return {
      tradableBalance: 0,
      requestWeight,
    }

  }

  const { available } = desiredAsset

  const { leverage } = await exchange.position!.getLeverage!({
    symbolPair,
    http,
  })

  const computedLeverage = leverage === 0
    ? 1
    : leverage

  const tradableBalance = new BigNumber(available)
    .times(computedLeverage)
    .toNumber()

  return {
    tradableBalance,
    requestWeight,
  }

}
