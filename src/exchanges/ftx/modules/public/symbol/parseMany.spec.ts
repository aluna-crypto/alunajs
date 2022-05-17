import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Ftx } from '../../../Ftx'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Ftx symbols just fine', async () => {

    // mocking
    const { parse } = mockParse({ module: parseMod })

    const rawSymbols = [...FTX_RAW_MARKETS, FTX_RAW_MARKETS[0]]
    const parsedSymbols = [...PARSED_SYMBOLS, PARSED_SYMBOLS[0]]

    each(parsedSymbols, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Ftx({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols,
    })


    // validating
    expect(parse.callCount).to.be.eq(FTX_RAW_MARKETS.length + 1)
    expect(symbols.length).to.be.eq(FTX_RAW_MARKETS.length + 1)

  })

})
