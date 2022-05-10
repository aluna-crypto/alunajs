import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Binance } from '../../../Binance'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'



describe(__filename, () => {

  it('should list Binance raw markets just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    publicRequest.returns(Promise.resolve(BINANCE_RAW_MARKETS))


    // executing
    const exchange = new Binance({})

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(BINANCE_RAW_MARKETS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBinanceEndpoints(exchange.settings).market.list,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
