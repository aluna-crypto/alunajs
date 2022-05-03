import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './parseMany'



export const mockBalanceParseMany = () => {

  const parseMany = stub()

  const wrapper = ImportMock.mockFunction(
    mod,
    'parseMany',
    parseMany,
  )

  return {
    parseMany,
    wrapper,
  }

}
