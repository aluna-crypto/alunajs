import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockGetHuobiAccountId = (params: {
  module: any
}) => {

  const { module } = params

  const getHuobiAccountId = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'getHuobiAccountId',
  )

  return {
    getHuobiAccountId,
    wrapper,
  }

}
