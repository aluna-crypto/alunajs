import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockListRaw } from '../../../../../../test/mocks/exchange/modules/mockListRaw'
import { Binance } from '../../../Binance'
import { BinanceHttp } from '../../../BinanceHttp'
import { getBinanceEndpoints } from '../../../binanceSpecs'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as listRawMod from '../symbol/listRaw'



describe(__filename, () => {

  it('should list Binance raw markets just fine', async () => {

    // preparing data

    const rawTickers = BINANCE_RAW_MARKETS
    const rawSymbols = BINANCE_RAW_SYMBOLS

    const rawMarketsResponse = {
      rawTickers,
      rawSymbols,
    }

    const exchange = new Binance({})

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BinanceHttp.prototype })

    publicRequest.onFirstCall().returns(Promise.resolve(rawTickers))
    publicRequest.onSecondCall().returns(Promise.resolve({ symbols: rawSymbols }))

    const { listRaw: listRawSymbols } = mockListRaw({ module: listRawMod })

    listRawSymbols.returns(Promise.resolve({ rawSymbols }))

    // executing

    const {
      rawMarkets,
      requestWeight,
    } = await exchange.market.listRaw()


    // validating
    expect(rawMarkets).to.deep.eq(rawMarketsResponse)

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(2)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getBinanceEndpoints(exchange.settings).market.list,
    })


    expect(authedRequest.callCount).to.be.eq(0)

  })

})
