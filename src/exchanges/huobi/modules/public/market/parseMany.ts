import debug from 'debug'
import {
  forEach,
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
  IHuobiMarketSchema,
  IHuobiMarketsSchema,
  IHuobiMarketTickerSchema,
} from '../../../schemas/IHuobiMarketSchema'



const log = debug('alunajs:huobi/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IHuobiMarketsSchema>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  const {
    rawSymbols,
    huobiMarkets,
  } = rawMarkets

  const pairSymbolsDictionary = keyBy(rawSymbols, 'symbol')

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  type TSrc = IHuobiMarketTickerSchema
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(huobiMarkets, (acc, huobiMarket) => {

    const { symbol } = huobiMarket

    const rawSymbol = pairSymbolsDictionary[symbol]

    if (rawSymbol) {

      const rawMarketRequest: IHuobiMarketSchema = {
        huobiMarket,
        rawSymbol,
      }

      const { market } = exchange.market.parse({
        rawMarket: rawMarketRequest,
      })

      acc.push(market)

    }

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Huobi`)

  return { markets }

}
