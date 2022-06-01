import { ImportMock } from 'ts-mock-imports'

import * as splitFtxSymbolPairMod from './splitFtxSymbolPair'



export const mockSplitFtxSymbolPair = () => {

  const splitFtxSymbolPair = ImportMock.mockFunction(
    splitFtxSymbolPairMod,
    'splitFtxSymbolPair',
  )

  return { splitFtxSymbolPair }

}
