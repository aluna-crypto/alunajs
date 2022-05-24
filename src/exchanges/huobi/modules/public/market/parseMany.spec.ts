import { expect } from 'chai'
import { cloneDeep, each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Huobi } from '../../../Huobi'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Huobi raw markets just fine', async () => {

    // preparing data
    const rawMarket = cloneDeep(HUOBI_RAW_MARKETS[0])

    rawMarket.symbol = 'non-existent'

    const rawMarketTickers = [...HUOBI_RAW_MARKETS, rawMarket]
    const rawSymbols = HUOBI_RAW_SYMBOLS

    const rawMarkets = {
      rawMarkets: rawMarketTickers,
      rawSymbols,
    }

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_MARKETS, (market, index) => {
      parse.onCall(index).returns({ market })
    })


    // executing
    const exchange = new Huobi({})

    const { markets } = exchange.market.parseMany({
      rawMarkets,
    })


    // validating
    expect(parse.callCount).to.be.eq(PARSED_MARKETS.length)
    expect(markets).to.deep.eq(PARSED_MARKETS)

  })

})
