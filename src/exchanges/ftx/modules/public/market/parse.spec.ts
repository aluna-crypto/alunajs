import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Ftx } from '../../../Ftx'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'



describe.skip(__filename, () => {

  it('should parse a Ftx raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = FTX_RAW_MARKETS[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Ftx({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    // TODO: add proper validations
    expect(market).to.exist

  })

})
