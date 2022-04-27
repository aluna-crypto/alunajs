import { expect } from 'chai'

import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import { BITTREX_PARSED_MARKETS } from '../../../test/fixtures/bittrexMarket'
import { list } from './list'
import { mockBittrexListRaw } from './listRaw.mock'
import { mockBittrexParseMany } from './parseMany.mock'



describe(__filename, () => {

  it('should list Bittrex parsed markets just fine', async () => {

    const {
      authedRequest,
      publicRequest,
      requestCount,
    } = mockBittrexHttp()

    const { listRaw } = mockBittrexListRaw()
    const { parseMany } = mockBittrexParseMany()

    const { markets } = await list()

    expect(markets).to.deep.eq(BITTREX_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.args[0][0]).to.deep.eq({
      http: {
        authedRequest,
        publicRequest,
        requestCount,
      },
    })

    expect(parseMany.callCount).to.be.eq(1)

  })

})
