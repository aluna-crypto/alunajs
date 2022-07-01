import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { Huobi } from '../../../Huobi'
import { HuobiHttp } from '../../../HuobiHttp'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as listRawMod from '../symbol/listRaw'



describe(__filename, () => {

  it('should list Huobi raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: HuobiHttp.prototype })

    publicRequest.returns(Promise.resolve(HUOBI_RAW_MARKETS))

    const { listRaw } = mockListRaw({
      module: listRawMod,
    })

    listRaw.returns(Promise.resolve({
      rawSymbols: HUOBI_RAW_SYMBOLS,
    }))

    // executing
    const exchange = new Huobi({})

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()

    // validating
    expect(rawMarkets).to.deep.eq({
      huobiMarkets: HUOBI_RAW_MARKETS,
      rawSymbols: HUOBI_RAW_SYMBOLS,
    })

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getHuobiEndpoints(exchange.settings).market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

    expect(listRaw.callCount).to.be.eq(1)

  })

})
