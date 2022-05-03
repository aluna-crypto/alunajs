import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockOrderPlace = (params: {
  module: any
}) => {

  const { module } = params

  const place = stub()

  const wrapper = ImportMock.mockFunction(
    module,
    'place',
    place,
  )

  return {
    place,
    wrapper,
  }

}
