import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { Bittrex } from '../../../Bittrex'
import { BittrexHttp } from '../../../BittrexHttp'
import { BITTREX_PRODUCTION_URL } from '../../../bittrexSpecs'
import { BITTREX_RAW_SYMBOLS } from '../../../test/fixtures/bittrexSymbols'



describe(__filename, () => {

  it('should list Bittrex raw symbols just fine', async () => {

    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    publicRequest.returns(Promise.resolve(BITTREX_RAW_SYMBOLS))

    const exchange = new Bittrex({ settings: {} })

    const {
      rawSymbols,
      requestCount,
    } = await exchange.symbol.listRaw()

    expect(rawSymbols).to.deep.eq(BITTREX_RAW_SYMBOLS)

    expect(requestCount).to.be.ok

    expect(publicRequest.callCount).to.be.eq(1)
    expect(publicRequest.args[0][0]).to.deep.eq({
      url: `${BITTREX_PRODUCTION_URL}/currencies`,
    })

    expect(authedRequest.callCount).to.be.eq(0)

  })

})
