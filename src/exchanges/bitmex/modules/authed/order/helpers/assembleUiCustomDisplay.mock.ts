import { ImportMock } from 'ts-mock-imports'

import * as assembleUiCustomDisplayMod from './assembleUiCustomDisplay'



export const mockAssembleUiCustomDisplay = () => {

  const assembleUiCustomDisplay = ImportMock.mockFunction(
    assembleUiCustomDisplayMod,
    'assembleUiCustomDisplay',
  )

  return { assembleUiCustomDisplay }

}
