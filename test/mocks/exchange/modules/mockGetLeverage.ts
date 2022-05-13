import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockGetLeverage = (params: {
  module: any
}) => {

  const { module } = params

  const getLeverage = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'getLeverage',
    getLeverage,
  )

  return {
    getLeverage,
    wrapper,
  }

}
