import { ImportMock } from 'ts-mock-imports'

import * as assembleRequestBodyMod from './assembleRequestBody'



export const mockAssembleRequestBody = () => {

  const assembleRequestBody = ImportMock.mockFunction(
    assembleRequestBodyMod,
    'assembleRequestBody',
  )

  return { assembleRequestBody }

}
