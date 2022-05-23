import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Huobi } from '../../../Huobi'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Huobi symbols just fine', async () => {

    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Huobi({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: HUOBI_RAW_SYMBOLS,
    })


    // validating
    expect(parse.callCount).to.be.eq(HUOBI_RAW_SYMBOLS.length)
    expect(symbols.length).to.be.eq(HUOBI_RAW_SYMBOLS.length)

  })

})
