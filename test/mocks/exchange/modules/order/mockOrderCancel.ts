import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockOrderCancel = (params: {
  module: any
}) => {

  const { module } = params

  const cancel = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'cancel',
    cancel,
  )

  return {
    cancel,
    wrapper,
  }

}
