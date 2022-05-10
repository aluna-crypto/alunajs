import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockGetRaw = (params: {
  module: any
}) => {

  const { module } = params

  const getRaw = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'getRaw',
    getRaw,
  )

  return {
    getRaw,
    wrapper,
  }

}
