import { expect } from 'chai'

import { mockMarketListRaw } from '../../../../../../test/mocks/exchange/modules/market/mockMarketListRaw'
import { mockMarketParseMany } from '../../../../../../test/mocks/exchange/modules/market/mockMarketParseMany'
import { Sample } from '../../../Sample'
import {
  SAMPLE_PARSED_MARKETS,
  SAMPLE_RAW_MARKETS,
} from '../../../test/fixtures/sampleMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Sample parsed markets just fine', async () => {

    // mocking
    const { listRaw } = mockMarketListRaw({ module: listRawMod })

    listRaw.returns({
      rawMarkets: SAMPLE_RAW_MARKETS,
      requestCount: {
        authed: 0,
        public: 0,
      },
    })

    const { parseMany } = mockMarketParseMany({ module: parseManyMod })

    parseMany.returns({ markets: SAMPLE_PARSED_MARKETS })


    // executing
    const exchange = new Sample({ settings: {} })

    const { markets } = await exchange.market.list()


    // validating
    expect(markets).to.deep.eq(SAMPLE_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.haveOwnProperty('http')

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawMarkets: SAMPLE_RAW_MARKETS,
    })

  })

})
