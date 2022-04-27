import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketListRawReturns } from '../../../../../lib/modules/public/IAlunaMarketModule'
import { IBittrexMarketsSchema } from '../../../schemas/IBittrexMarketSchema'
import { BITTREX_RAW_MARKETS } from '../../../test/fixtures/bittrexMarket'
import * as listRawMod from './listRaw'



export const mockBittrexListRaw = (
  returns: IAlunaMarketListRawReturns<IBittrexMarketsSchema> = {
    rawMarkets: BITTREX_RAW_MARKETS,
    requestCount: {
      authed: 0,
      public: 3,
    },
  },
) => {

  const listRaw = ImportMock.mockFunction(
    listRawMod,
    'listRaw',
    Promise.resolve(returns),
  )

  return {
    listRaw,
  }

}
