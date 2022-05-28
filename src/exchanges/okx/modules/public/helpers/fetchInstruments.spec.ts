import { expect } from 'chai'
import { mockHttp } from '../../../../../../test/mocks/exchange/Http'

import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { Okx } from '../../../Okx'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'
import * as fetchInstrumentsMod from './fetchInstruments'



describe(__filename, () => {

  const {
    fetchInstruments,
  } = fetchInstrumentsMod

  it('should get a Okx raw order status just fine', async () => {

    // preparing data
    const mockedRawSymbols = OKX_RAW_SYMBOLS

    // mocking

    const http = new OkxHttp({ })

    const {
      publicRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    publicRequest
      .onFirstCall()
      .returns(Promise.resolve(mockedRawSymbols))

    // executing
    const exchange = new Okx({})

    const { instruments } = await fetchInstruments({
      settings: exchange.settings,
      http,
      type: OkxSymbolTypeEnum.SPOT,
    })

    // validating
    expect(instruments).to.deep.eq(OKX_RAW_SYMBOLS)

    expect(publicRequest.callCount).to.be.eq(1)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).symbol.list(OkxSymbolTypeEnum.SPOT),
    })

  })

})
