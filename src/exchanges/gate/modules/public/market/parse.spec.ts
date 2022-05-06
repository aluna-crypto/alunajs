import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Gate } from '../../../Gate'
import { GATE_RAW_MARKETS } from '../../../test/fixtures/gateMarket'



describe.skip(__filename, () => {

  it('should parse a Gate raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = GATE_RAW_MARKETS[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Gate({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    // TODO: add proper validations
    expect(market).to.exist

  })

})
