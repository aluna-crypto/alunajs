import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockOrderGetRaw = (params: {
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
