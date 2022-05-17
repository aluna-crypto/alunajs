import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Ftx } from '../../../Ftx'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'



describe(__filename, () => {

  it('should list Ftx raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    publicRequest.returns(Promise.resolve(FTX_RAW_MARKETS))

    // executing
    const exchange = new Ftx({})

    const {
      rawSymbols,
      requestWeight,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq(FTX_RAW_MARKETS)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getFtxEndpoints(exchange.settings).symbol.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
