import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Valr } from '../../../Valr'
import { VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'



describe.skip(__filename, () => {

  it('should parse a Valr raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = VALR_RAW_MARKETS[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Valr({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    // TODO: add proper validations
    expect(market).to.exist

  })

})
