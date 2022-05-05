import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Bitfinex } from '../../../Bitfinex'
import { BITFINEX_RAW_MARKETS } from '../../../test/fixtures/bitfinexMarket'



describe.skip(__filename, () => {

  it('should parse a Bitfinex raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = BITFINEX_RAW_MARKETS[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Bitfinex({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    // TODO: add proper validations
    expect(market).to.exist

  })

})
