import { ImportMock } from 'ts-mock-imports'

import * as translateSymbolIdMod from './translateSymbolId'



export const mockTranslateSymbolId = (
  returns = 'BTC',
) => {

  const translateSymbolId = ImportMock.mockFunction(
    translateSymbolIdMod,
    'translateSymbolId',
    returns,
  )

  return { translateSymbolId }

}
