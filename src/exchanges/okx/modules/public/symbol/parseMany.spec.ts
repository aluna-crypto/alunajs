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

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Okx({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: OKX_RAW_SYMBOLS,
    })


    // validating
    expect(parse.callCount).to.be.eq(OKX_RAW_SYMBOLS.length)
    expect(symbols.length).to.be.eq(OKX_RAW_SYMBOLS.length)

  })

})
