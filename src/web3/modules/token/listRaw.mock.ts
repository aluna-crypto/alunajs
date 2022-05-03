import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './listRaw'



export const mockTokenListRaw = () => {

  const listRaw = stub()

  const wrapper = ImportMock.mockFunction(
    mod,
    'listRaw',
    listRaw,
  )

  return {
    listRaw,
    wrapper,
  }

}
