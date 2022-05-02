import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockOrderParseMany = (params: {
  module: any
}) => {

  const { module } = params

  const parseMany = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'parseMany',
    parseMany,
  )

  return {
    parseMany,
    wrapper,
  }

}
