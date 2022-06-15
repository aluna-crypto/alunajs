import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { OkxSymbolTypeEnum } from '../../../enums/OkxSymbolTypeEnum'
import { Okx } from '../../../Okx'
import { OkxHttp } from '../../../OkxHttp'
import { getOkxEndpoints } from '../../../okxSpecs'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'



describe(__filename, () => {

  it('should list Okx raw symbols just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: OkxHttp.prototype })

    publicRequest.returns(Promise.resolve(OKX_RAW_SYMBOLS))


    // executing
    const exchange = new Okx({})

    const {
      rawSymbols,
      requestWeight,
    } = await exchange.symbol.listRaw()


    // validating
    expect(rawSymbols).to.deep.eq([
      ...OKX_RAW_SYMBOLS,
      ...OKX_RAW_SYMBOLS,
    ])

    expect(requestWeight).to.be.ok

    expect(publicRequest.callCount).to.be.eq(2)

    expect(publicRequest.firstCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).symbol.list(OkxSymbolTypeEnum.SPOT),
    })

    expect(publicRequest.secondCall.args[0]).to.deep.eq({
      url: getOkxEndpoints(exchange.settings).symbol.list(OkxSymbolTypeEnum.MARGIN),
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
