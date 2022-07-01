import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Huobi } from '../../../Huobi'
import { HuobiHttp } from '../../../HuobiHttp'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should get Huobi market just fine', async () => {

    // preparing data
    const mockedRawMarket = HUOBI_RAW_MARKETS[0]
    const mockedMarket = PARSED_MARKETS[0]
    const symbolPair = mockedRawMarket.symbol


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawMarket: mockedRawMarket }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ market: mockedMarket })


    // executing
    const exchange = new Huobi({})

    const {
      market,
      requestWeight,
    } = await exchange.market.get!({ symbolPair })


    // validating
    expect(market).to.deep.eq(mockedMarket)

    expect(requestWeight).to.be.ok

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      symbolPair,
      http: new HuobiHttp({}),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawMarket: mockedRawMarket,
    })

  })

})
