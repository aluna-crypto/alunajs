import { ImportMock } from 'ts-mock-imports'

import * as computeOrderAmountMod from './computeOrderAmount'



export const mockComputeOrderAmount = () => {

  const computeOrderAmount = ImportMock.mockFunction(
    computeOrderAmountMod,
    'computeOrderAmount',
  )

  return { computeOrderAmount }

}
