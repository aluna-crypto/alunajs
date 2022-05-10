import { ImportMock } from 'ts-mock-imports'

import * as splitSymbolPairMod from './splitSymbolPair'



export const mockSplitSymbolPair = (
  returns: splitSymbolPairMod.ISplitSymbolPairResponse,
) => {

  const splitSymbolPair = ImportMock.mockFunction(
    splitSymbolPairMod,
    'splitSymbolPair',
    returns,
  )

  return {
    splitSymbolPair,
  }

}
