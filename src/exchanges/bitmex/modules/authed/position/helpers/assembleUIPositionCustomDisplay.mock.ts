import { ImportMock } from 'ts-mock-imports'

import * as assembleUIPositionCustomDisplayMod from './assembleUIPositionCustomDisplay'



export const mockAssembleUIPositionCustomDisplay = () => {

  const assembleUIPositionCustomDisplay = ImportMock.mockFunction(
    assembleUIPositionCustomDisplayMod,
    'assembleUIPositionCustomDisplay',
  )

  return { assembleUIPositionCustomDisplay }

}
