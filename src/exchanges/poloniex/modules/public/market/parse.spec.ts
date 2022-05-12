import { expect } from 'chai'

import { mockTranslateSymbolId } from '../../../../../utils/mappings/translateSymbolId.mock'
import { Poloniex } from '../../../Poloniex'
import { POLONIEX_RAW_MARKETS } from '../../../test/fixtures/poloniexMarket'



describe.skip(__filename, () => {

  it('should parse a Poloniex raw market just fine', async () => {

    // preparing data
    const translatedSymbolId = 'BTC'
    const rawMarket = POLONIEX_RAW_MARKETS[0]


    // mocking
    const { translateSymbolId } = mockTranslateSymbolId()

    translateSymbolId.returns(translatedSymbolId)


    // executing
    const exchange = new Poloniex({})

    const { market } = exchange.market.parse({
      rawMarket,
    })


    // validating
    // TODO: add proper validations
    expect(market).to.exist

  })

})
