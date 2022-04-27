import { expect } from 'chai'

import { mockBittrexHttp } from '../../../BittrexHttp.mock'
import { BITTREX_PARSED_MARKETS } from '../../../test/fixtures/bittrexMarket'
import { list } from './list'
import { mockBittrexListRaw } from './listRaw.mock'
import { mockBittrexParseMany } from './parseMany.mock'



describe(__filename, () => {

  it('should list Bittrex parsed markets just fine', async () => {

    mockBittrexHttp()

    const { listRaw } = mockBittrexListRaw()
    const { parseMany } = mockBittrexParseMany()

    const { markets } = await list()

    expect(markets).to.deep.eq(BITTREX_PARSED_MARKETS)

    expect(listRaw.callCount).to.be.eq(1)

    expect(parseMany.callCount).to.be.eq(1)


  })

})
