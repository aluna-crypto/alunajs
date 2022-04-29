import { expect } from 'chai'

import { mockSymbolListRaw } from '../../../../../../test/mocks/exchange/modules/symbol/listRaw'
import { mockSymbolParseMany } from '../../../../../../test/mocks/exchange/modules/symbol/parseMany'
import { Bittrex } from '../../../Bittrex'
import {
  BITTREX_PARSED_SYMBOLS,
  BITTREX_RAW_SYMBOLS,
} from '../../../test/fixtures/bittrexSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Bittrex parsed symbols just fine', async () => {

    // mocking
    const { listRaw } = mockSymbolListRaw({ module: listRawMod })

    listRaw.returns({
      rawSymbols: BITTREX_RAW_SYMBOLS,
      requestCount: {
        authed: 0,
        public: 0,
      },
    })

    const { parseMany } = mockSymbolParseMany({ module: parseManyMod })

    parseMany.returns({ symbols: BITTREX_PARSED_SYMBOLS })


    // executing
    const exchange = new Bittrex({ settings: {} })

    const { symbols } = await exchange.symbol.list()


    // validating
    expect(symbols).to.deep.eq(BITTREX_PARSED_SYMBOLS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.haveOwnProperty('http')

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawSymbols: BITTREX_RAW_SYMBOLS,
    })

  })

})
