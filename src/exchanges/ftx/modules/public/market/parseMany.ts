import debug from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { IFtxMarketSchema } from '../../../schemas/IFtxMarketSchema'



const log = debug('alunajs:ftx/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IFtxMarketSchema[]>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  type TAcc = IFtxMarketSchema
  type TSrc = IAlunaMarketSchema[]

  const markets = reduce<TAcc, TSrc>(rawMarkets, (acc, rawMarket) => {

    const {
      name,
      underlying,
    } = rawMarket

    const [baseCurrency] = name.split('-')

    const isPredict = underlying && (underlying !== baseCurrency)

    // skipping predict markets
    if (!isPredict) {

      const { market } = exchange.market.parse({
        rawMarket,
      })

      acc.push(market)

    }

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Ftx`)

  return { markets }

}
