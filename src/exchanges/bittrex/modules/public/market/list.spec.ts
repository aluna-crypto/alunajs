import { expect } from 'chai'

import { mockMarketListRaw } from '../../../../../../test/mocks/exchange/modules/market/listRaw'
import { mockMarketParseMany } from '../../../../../../test/mocks/exchange/modules/market/parseMany'
import { Bittrex } from '../../../Bittrex'
import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKETS,
} from '../../../test/fixtures/bittrexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Bittrex parsed markets just fine', async () => {

    const { listRaw } = mockMarketListRaw({ module: listRawMod })

    listRaw.returns({
      rawMarkets: BITTREX_RAW_MARKETS,
      requestCount: {
        authed: 0,
        public: 0,
      },
    })

    const { parseMany } = mockMarketParseMany({ module: parseManyMod })

    parseMany.onCall(0).returns({
      markets: BITTREX_PARSED_MARKETS,
    })

    const exchange = new Bittrex({ settings: {} })

    const { markets } = await exchange.market.list()

    expect(markets).to.deep.eq(BITTREX_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.args[0][0]).to.haveOwnProperty('http')

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.args[0][0]).to.deep.eq({ rawMarkets: BITTREX_RAW_MARKETS })

  })

})
