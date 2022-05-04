import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Sample } from '../../../Sample'
import { SAMPLE_RAW_SYMBOLS } from '../../../test/fixtures/sampleSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Sample symbols just fine', async () => {

    // preparing data
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Sample({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: SAMPLE_RAW_SYMBOLS,
    })


    // validating
    expect(parse.callCount).to.be.eq(SAMPLE_RAW_SYMBOLS.length)
    expect(symbols.length).to.be.eq(SAMPLE_RAW_SYMBOLS.length)

  })

})
