import { ImportMock } from 'ts-mock-imports'

import { AlunaSymbolMapping } from './AlunaSymbolMapping'



export const mockAlunaSymbolMapping = (
  params?: {
    returnSymbol: string
  },
) => {

  const returnSymbol = params
    ? params.returnSymbol
    : 'BTC'

  const alunaSymbolMappingMock = ImportMock.mockFunction(
    AlunaSymbolMapping,
    'translateSymbolId',
    returnSymbol,
  )

  return { alunaSymbolMappingMock }

}
