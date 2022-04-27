import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketParseManyReturns } from '../../../../../lib/modules/public/IAlunaMarketModule'
import { BITTREX_PARSED_MARKETS } from '../../../test/fixtures/bittrexMarket'
import * as ParseManyMod from './parseMany'



export const mockBittrexParseMany = (
  returns: IAlunaMarketParseManyReturns = {
    markets: BITTREX_PARSED_MARKETS,
  },
) => {

  const parseMany = ImportMock.mockFunction(
    ParseManyMod,
    'parseMany',
    returns,
  )

  return {
    parseMany,
  }

}
