import debug from 'debug'
import { reduce } from 'lodash'

import { IAlunaExchangePublic } from '../../../../../lib/core/IAlunaExchange'
import {
  IAlunaMarketParseManyParams,
  IAlunaMarketParseManyReturns,
} from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IAlunaMarketSchema } from '../../../../../lib/schemas/IAlunaMarketSchema'
import { BitmexInstrumentStateEnum } from '../../../enums/BitmexInstrumentStateEnum'
import { IBitmexMarketSchema } from '../../../schemas/IBitmexMarketSchema'



const log = debug('@alunajs:bitmex/market/parseMany')



export const parseMany = (exchange: IAlunaExchangePublic) => (
  params: IAlunaMarketParseManyParams<IBitmexMarketSchema[]>,
): IAlunaMarketParseManyReturns => {

  const { rawMarkets } = params

  type TSrc = IBitmexMarketSchema
  type TAcc = IAlunaMarketSchema[]

  const markets = reduce<TSrc, TAcc>(rawMarkets, (acc, rawMarket) => {

    const {
      state,
      symbol,
    } = rawMarket

    const isSpotInstrument = /_/.test(symbol)

    if (state !== BitmexInstrumentStateEnum.OPEN || isSpotInstrument) {

      return acc

    }

    const { market } = exchange.market.parse({ rawMarket })

    acc.push(market)

    return acc

  }, [])

  log(`parsed ${markets.length} markets for Bitmex`)

  return { markets }

}
