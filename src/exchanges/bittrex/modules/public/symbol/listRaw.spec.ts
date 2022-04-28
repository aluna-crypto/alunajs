import { expect } from 'chai'

import { Bittrex } from '../../../Bittrex'
import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import { BITTREX_RAW_SYMBOLS } from '../../../test/fixtures/bittrexSymbols'



describe(__filename, () => {

  it('should list Bittrex raw symbols just fine', async () => {

    const {
      publicRequest,
    } = mockBittrexHttp()

    publicRequest.onCall(0).returns(Promise.resolve(BITTREX_RAW_SYMBOLS))

    const exchange = new Bittrex({ settings: {} })

    const { rawSymbols } = await exchange.symbol.listRaw()

    expect(rawSymbols).to.deep.eq(BITTREX_RAW_SYMBOLS)

    expect(publicRequest.callCount).to.be.eq(1)

  })

})
