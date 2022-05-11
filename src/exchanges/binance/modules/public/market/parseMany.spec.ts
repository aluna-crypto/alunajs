import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Binance } from '../../../Binance'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Binance raw markets just fine', async () => {

    // preparing data
    const rawTickers = BINANCE_RAW_MARKETS
    const rawSymbols = BINANCE_RAW_SYMBOLS
    const parsedMarkets = PARSED_MARKETS.slice(0, 2)

    const rawMarkets = {
      rawTickers,
      rawSymbols,
    }

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedMarkets, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Binance({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(parsedMarkets.length)
    expect(markets).to.deep.eq(parsedMarkets)

  })

})
