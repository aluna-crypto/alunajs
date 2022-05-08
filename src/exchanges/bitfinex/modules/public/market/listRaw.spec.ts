import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bitfinex } from '../../../Bitfinex'
import { BitfinexHttp } from '../../../BitfinexHttp'
import { getBitfinexEndpoints } from '../../../bitfinexSpecs'
import {
  BITFINEX_MARGIN_ENABLED_CURRENCIES,
  BITFINEX_RAW_TICKERS,
} from '../../../test/fixtures/bitfinexMarket'



describe(__filename, () => {

  it('should list Bitfinex raw markets just fine', async () => {

    // preparing data
    const rawTickers = BITFINEX_RAW_TICKERS
    const enabledMarginCurrencies = BITFINEX_MARGIN_ENABLED_CURRENCIES

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BitfinexHttp.prototype })

    publicRequest.onFirstCall().returns(Promise.resolve(rawTickers))
    publicRequest.onSecondCall().returns(Promise.resolve(enabledMarginCurrencies))


    // executing
    const exchange = new Bitfinex({})

    const {
      rawMarkets,
      requestCount,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq({
      tickers: rawTickers,
      enabledMarginCurrencies,
    })

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(2)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBitfinexEndpoints(exchange.settings).market.tickers,
    })
    expect(publicRequest.secondCall.args[0]).to.deep.eq({
      url: getBitfinexEndpoints(exchange.settings).market.enabledMarginCurrencies,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
