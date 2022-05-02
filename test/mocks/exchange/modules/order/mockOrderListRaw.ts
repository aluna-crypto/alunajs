import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockOrderListRaw = (params: {
  module: any
}) => {

  const { module } = params

  const listRaw = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'listRaw',
    listRaw,
  )

  return {
    listRaw,
    wrapper,
  }

}
