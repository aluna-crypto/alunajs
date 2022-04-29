import { expect } from 'chai'
import { each } from 'lodash'

import { mockSymbolParse } from '../../../../../../test/mocks/exchange/modules/symbol/parse'
import { Bittrex } from '../../../Bittrex'
import {
  BITTREX_PARSED_SYMBOLS,
  BITTREX_RAW_SYMBOLS,
} from '../../../test/fixtures/bittrexSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bittrex symbols just fine', async () => {

    const { parse } = mockSymbolParse({ module: parseMod })

    each(BITTREX_PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })

    const exchange = new Bittrex({ settings: {} })

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: BITTREX_RAW_SYMBOLS,
    })

    expect(symbols.length).to.be.eq(BITTREX_RAW_SYMBOLS.length)

    expect(parse.callCount).to.be.eq(BITTREX_RAW_SYMBOLS.length)

  })

})
