import {
  stub,
} from 'sinon'
import {
  ImportMock,
} from 'ts-mock-imports'



export const mockParseDetails = (params: {
  module: any
}) => {

  const { module } = params

  const parseDetails = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'parseDetails',
    parseDetails,
  )

  return {
    parseDetails,
    wrapper,
  }

}
