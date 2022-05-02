import {
  stub,
} from 'sinon'
import {
  ImportMock,
} from 'ts-mock-imports'



export const mockParsePermissions = (params: {
  module: any
}) => {

  const { module } = params

  const parsePermissions = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'parsePermissions',
    parsePermissions,
  )

  return {
    parsePermissions,
    wrapper,
  }

}
