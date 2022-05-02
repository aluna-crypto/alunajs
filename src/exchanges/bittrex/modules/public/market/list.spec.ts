import { expect } from 'chai'

import { mockMarketListRaw } from '../../../../../../test/mocks/exchange/modules/market/mockMarketListRaw'
import { mockMarketParseMany } from '../../../../../../test/mocks/exchange/modules/market/mockMarketParseMany'
import { Bittrex } from '../../../Bittrex'
import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKETS,
} from '../../../test/fixtures/bittrexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Bittrex parsed markets just fine', async () => {

    // mocking
    const { listRaw } = mockMarketListRaw({ module: listRawMod })

    listRaw.returns({
      rawMarkets: BITTREX_RAW_MARKETS,
      requestCount: {
        authed: 0,
        public: 0,
      },
    })

    const { parseMany } = mockMarketParseMany({ module: parseManyMod })

    parseMany.returns({ markets: BITTREX_PARSED_MARKETS })


    // executing
    const exchange = new Bittrex({ settings: {} })

    const { markets } = await exchange.market.list()


    // validating
    expect(markets).to.deep.eq(BITTREX_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.haveOwnProperty('http')

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawMarkets: BITTREX_RAW_MARKETS,
    })

  })

})
