import { ImportMock } from 'ts-mock-imports'

import * as parseBitmexInstrumentMod from './parseBitmexInstrument'



export const mockParseBitmexInstrument = () => {

  const parseBitmexInstrument = ImportMock.mockFunction(
    parseBitmexInstrumentMod,
    'parseBitmexInstrument',
  )

  return { parseBitmexInstrument }

}
