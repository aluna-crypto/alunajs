import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './list'



export const mockTokenList = () => {

  const list = stub()

  const wrapper = ImportMock.mockFunction(
    mod,
    'list',
    list,
  )

  return {
    list,
    wrapper,
  }

}
