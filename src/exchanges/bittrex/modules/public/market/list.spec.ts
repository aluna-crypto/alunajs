import { expect } from 'chai'

import { mockMarketListRaw } from '../../../../../../test/helpers/exchange/modules/market/listRaw'
import { mockMarketParseMany } from '../../../../../../test/helpers/exchange/modules/market/parseMany'
import { Bittrex } from '../../../Bittrex'
import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import { IBittrexMarketsSchema } from '../../../schemas/IBittrexMarketSchema'
import {
  BITTREX_PARSED_MARKETS,
  BITTREX_RAW_MARKETS,
} from '../../../test/fixtures/bittrexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Bittrex parsed markets just fine', async () => {


    const { listRaw } = mockMarketListRaw<IBittrexMarketsSchema>({
      module: listRawMod,
      returns: {
        rawMarkets: BITTREX_RAW_MARKETS,
        requestCount: {
          authed: 0,
          public: 0,
        },
      },
    })

    const { parseMany } = mockMarketParseMany({
      module: parseManyMod,
      returns: {
        markets: BITTREX_PARSED_MARKETS,
      },
    })

    const exchange = new Bittrex({ settings: {} })

    const {
      authedRequest,
      publicRequest,
      requestCount,
    } = mockBittrexHttp()


    const { markets } = await exchange.market.list()

    expect(markets).to.deep.eq(BITTREX_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.args[0][0]).to.deep.eq({
      http: {
        authedRequest,
        publicRequest,
        requestCount,
      },
    })

    expect(parseMany.callCount).to.be.eq(1)

  })

})
