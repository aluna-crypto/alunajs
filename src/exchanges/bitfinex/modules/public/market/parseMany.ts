import debug from 'debug'
import {
  keyBy,
  reduce,
} from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import {
  IBitfinexMarketSchema,
  IBitfinexMarketsSchema,
  IBitfinexTicker,
} from '../../../schemas/IBitfinexMarketSchema'



const log = debug('alunajs:bitfinex/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IBitfinexMarketsSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  const {
    tickers,
    enabledMarginCurrencies: [enabledMarginCurrencies],
  } = rawMarkets

  const enabledMarginDict = keyBy(enabledMarginCurrencies)

  type TSrc = IBitfinexTicker
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(tickers, (acc, ticker) => {

    const [currency] = ticker

    // skipping 'funding' and 'derivative' markets for now
    if (/f|F0/.test(currency)) {

      return acc

    }

    // Transforming 'tBTCETH' into 'BTCETH'
    const transformedCurrency = currency.slice(1)

    const rawMarket: IBitfinexMarketSchema = {
      ticker,
      enabledMarginCurrency: enabledMarginDict[transformedCurrency],
    }

    const { market } = exchange.market.parse({
      rawMarket,
    })

    acc.push(market)

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Bitfinex`)

  return { markets }

}
