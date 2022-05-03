import { ImportMock } from 'ts-mock-imports'

import * as mod from './list'



export const mockBalanceParse = () => {

  const parseBalances = ImportMock.mockFunction(
    mod,
    'parseBalances',
  )

  return { parseBalances }

}
