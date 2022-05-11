import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { Binance } from '../../../Binance'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Binance symbols just fine', async () => {

    // preparing data
    const { parse } = mockParse({ module: parseMod })

    each(PARSED_SYMBOLS, (symbol, index) => {
      parse.onCall(index).returns({ symbol })
    })


    // executing
    const exchange = new Binance({})

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: BINANCE_RAW_SYMBOLS,
    })


    // validating
    expect(parse.callCount).to.be.eq(BINANCE_RAW_SYMBOLS.length + 1)
    expect(symbols.length).to.be.eq(BINANCE_RAW_SYMBOLS.length + 1)

  })

})
