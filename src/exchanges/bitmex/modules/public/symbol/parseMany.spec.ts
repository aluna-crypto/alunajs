import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Bitmex } from '../../../Bitmex'
import { BITMEX_RAW_SYMBOLS } from '../../../test/fixtures/bitmexSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bitmex symbols just fine', async () => {

    // preparing data
    const rawSymbols = cloneDeep(BITMEX_RAW_SYMBOLS.slice(0, 2))
    rawSymbols[0].rootSymbol = 'XBT'
    rawSymbols[0].quoteCurrency = 'ETH'
    rawSymbols[1].rootSymbol = 'ETH'
    rawSymbols[1].quoteCurrency = 'XBT'

    const parsedSymbols = PARSED_SYMBOLS.slice(0, 2)


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedSymbols, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Bitmex({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols,
    })


    // validating
    expect(symbols).to.deep.eq(parsedSymbols)

    expect(parse.callCount).to.be.eq(parsedSymbols.length)
    expect(symbols.length).to.be.eq(parsedSymbols.length)

  })

})
