import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './getRawTotalBalance'



export const mockGetRawTotalBalance = () => {

  const getRawTotalBalance = stub()

  const wrapper = ImportMock.mockFunction(
    mod,
    'getRawTotalBalance',
    getRawTotalBalance,
  )

  return {
    getRawTotalBalance,
    wrapper,
  }

}
