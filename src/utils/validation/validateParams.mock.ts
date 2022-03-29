import { ImportMock } from 'ts-mock-imports'

import * as validateParamsMod from './validateParams'



export const mockValidateParams = (params = {}) => {

  const validateParamsMock = ImportMock.mockFunction(
    validateParamsMod,
    'validateParams',
    params,
  )

  return {
    validateParamsMock,
  }

}
