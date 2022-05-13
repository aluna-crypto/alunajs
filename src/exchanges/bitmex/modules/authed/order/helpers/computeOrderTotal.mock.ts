import { ImportMock } from 'ts-mock-imports'

import * as computeOrderTotalMod from './computeOrderTotal'



export const mockComputeOrderTotal = () => {

  const computeOrderTotal = ImportMock.mockFunction(
    computeOrderTotalMod,
    'computeOrderTotal',
  )

  return { computeOrderTotal }

}
