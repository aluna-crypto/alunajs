import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Bitfinex } from '../../../Bitfinex'
import { BITFINEX_RAW_SYMBOLS } from '../../../test/fixtures/bitfinexSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bitfinex symbols just fine', async () => {

    // preparing data
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Bitfinex({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: BITFINEX_RAW_SYMBOLS,
    })


    // validating
    expect(parse.callCount).to.be.eq(BITFINEX_RAW_SYMBOLS.length)
    expect(symbols.length).to.be.eq(BITFINEX_RAW_SYMBOLS.length)

  })

})
