import { expect } from 'chai'

import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { mockSymbolListRaw } from '../../../../../../test/mocks/exchange/modules/symbol/mockSymbolListRaw'
import { mockSymbolParseMany } from '../../../../../../test/mocks/exchange/modules/symbol/mockSymbolParseMany'
import { Sample } from '../../../Sample'
import { SAMPLE_RAW_SYMBOLS } from '../../../test/fixtures/sampleSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  it('should list Sample parsed symbols just fine', async () => {

    // mocking
    const { listRaw } = mockSymbolListRaw({ module: listRawMod })

    listRaw.returns({
      rawSymbols: SAMPLE_RAW_SYMBOLS,
      requestCount: {
        authed: 0,
        public: 0,
      },
    })

    const { parseMany } = mockSymbolParseMany({ module: parseManyMod })

    parseMany.returns({ symbols: PARSED_SYMBOLS })


    // executing
    const exchange = new Sample({ settings: {} })

    const { symbols } = await exchange.symbol.list()


    // validating
    expect(symbols).to.deep.eq(PARSED_SYMBOLS)

    expect(listRaw.callCount).to.be.eq(1)
    expect(listRaw.firstCall.args[0]).to.haveOwnProperty('http')

    expect(parseMany.callCount).to.be.eq(1)
    expect(parseMany.firstCall.args[0]).to.deep.eq({
      rawSymbols: SAMPLE_RAW_SYMBOLS,
    })

  })

})
