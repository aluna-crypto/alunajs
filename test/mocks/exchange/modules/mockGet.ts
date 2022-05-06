import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockGet = (params: {
  module: any
}) => {

  const { module } = params

  const get = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'get',
    get,
  )

  return {
    get,
    wrapper,
  }

}
