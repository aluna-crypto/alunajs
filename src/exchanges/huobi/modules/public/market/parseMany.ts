import debug from 'debug'
import { forEach, reduce } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IHuobiMarketSchema, IHuobiMarketsSchema, IHuobiMarketTickerSchema } from '../../../schemas/IHuobiMarketSchema'
import { IHuobiSymbolSchema } from '../../../schemas/IHuobiSymbolSchema'



const log = debug('alunajs:huobi/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IHuobiMarketsSchema>,
): IAlunaMarketParseManyReturns => {

  const {
    rawMarkets: rawMarketsInfo,
  } = params

  const {
    rawMarkets,
    rawSymbols,
  } = rawMarketsInfo

  const pairSymbolsDictionary: { [key:string]: IHuobiSymbolSchema } = {}

  forEach(rawSymbols, (pair) => {

    const { symbol } = pair

    pairSymbolsDictionary[symbol] = pair

  })

  type TSrc = IHuobiMarketTickerSchema
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(
    rawMarkets,
    (accumulator, rawMarket) => {

      const { symbol } = rawMarket

      const rawSymbol = pairSymbolsDictionary[symbol]

      if (rawSymbol) {

        const rawMarketRequest: IHuobiMarketSchema = {
          rawMarket,
          rawSymbol,
        }

        const { market } = exchange.market.parse({
          rawMarket: rawMarketRequest,
        })

        accumulator.push(market)

      }


      return accumulator

    }, [],
  )

  log(`parsed ${markets.length} markets for Huobi`)

  return { markets }

}
