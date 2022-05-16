import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Poloniex } from '../../../Poloniex'
import {
  POLONIEX_RAW_SYMBOL_RESPONSE,
  POLONIEX_RAW_SYMBOLS,
} from '../../../test/fixtures/poloniexSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Poloniex symbols just fine', async () => {

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Poloniex({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: POLONIEX_RAW_SYMBOL_RESPONSE,
    })

    // validating
    expect(parse.callCount).to.be.eq(POLONIEX_RAW_SYMBOLS.length)
    expect(symbols.length).to.be.eq(POLONIEX_RAW_SYMBOLS.length)

  })

})
