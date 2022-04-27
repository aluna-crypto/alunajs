import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketParseReturns } from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BITTREX_PARSED_MARKETS } from '../../../test/fixtures/bittrexMarket'
import * as parseMod from './parse'



export const mockBittrexParse = (
  returns: IAlunaMarketParseReturns = {
    market: BITTREX_PARSED_MARKETS[0],
  },
) => {

  const parse = ImportMock.mockFunction(
    parseMod,
    'parse',
    returns,
  )

  return {
    parse,
  }

}
