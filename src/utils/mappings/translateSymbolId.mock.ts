import { ImportMock } from 'ts-mock-imports'

import * as translateSymbolIdMod from './translateSymbolId'



export const mockTranslateSymbolId = () => {

  const translateSymbolId = ImportMock.mockFunction(
    translateSymbolIdMod,
    'translateSymbolId',
  )

  return { translateSymbolId }

}
