import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Okx } from '../../../Okx'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Okx symbols just fine', async () => {

    // mocking
    const { parse } = mockParse({ module: parseMod })

    const parsedSymbols = [...PARSED_SYMBOLS, PARSED_SYMBOLS[0]]
    const rawSymbols = OKX_RAW_SYMBOLS

    each(parsedSymbols, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Okx({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols,
    })


    // validating
    expect(parse.callCount).to.be.eq(rawSymbols.length)
    expect(symbols.length).to.be.eq(rawSymbols.length)

  })

})
