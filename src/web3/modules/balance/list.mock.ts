import { ImportMock } from 'ts-mock-imports'

import * as mod from './parseMany'



export const mockBalanceParse = () => {

  const parseMany = ImportMock.mockFunction(
    mod,
    'parseMany',
  )

  return { parseMany }

}
