import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './getTotalBalance'



export const mockGetTotalBalance = () => {

  const getTotalBalance = stub()

  const wrapper = ImportMock.mockFunction(
    mod,
    'getTotalBalance',
    getTotalBalance,
  )

  return {
    getTotalBalance,
    wrapper,
  }

}
