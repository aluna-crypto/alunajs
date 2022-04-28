import { expect } from 'chai'
import { each } from 'lodash'

import { mockSymbolParse } from '../../../../../../test/helpers/exchange/modules/symbol/parse'
import { Bittrex } from '../../../Bittrex'
import { bittrexBaseSpecs } from '../../../bittrexSpecs'
import {
  BITTREX_PARSED_SYMBOLS,
  BITTREX_RAW_SYMBOLS,
} from '../../../test/fixtures/bittrexSymbols'
import * as parseMod from './parse'



describe(__filename, () => {

  it('should parse many Bittrex symbols just fine', async () => {

    const { parse } = mockSymbolParse({
      module: parseMod,
      returns: {
        symbol: BITTREX_PARSED_SYMBOLS[0],
      },
    })

    parse
      .onFirstCall()
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[0] })
      .onSecondCall()
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[1] })
      .onThirdCall()
      .returns({ symbol: BITTREX_PARSED_SYMBOLS[2] })

    const exchange = new Bittrex({ settings: {} })

    const { symbols } = exchange.symbol.parseMany({
      rawSymbols: BITTREX_RAW_SYMBOLS,
    })

    each(symbols, (s, i) => {

      expect(s.exchangeId).to.be.eq(bittrexBaseSpecs.id)
      expect(s.id).to.be.eq(BITTREX_PARSED_SYMBOLS[i].id)

      expect(parse.args[i][0]).to.deep.eq({
        rawSymbol: BITTREX_RAW_SYMBOLS[i],
      })

    })

    expect(parse.callCount).to.be.eq(3)

  })

})
