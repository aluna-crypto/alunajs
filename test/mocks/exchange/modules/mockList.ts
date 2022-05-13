import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockList = (params: {
  module: any
}) => {

  const { module } = params

  const list = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'list',
    list,
  )

  return {
    list,
    wrapper,
  }

}
