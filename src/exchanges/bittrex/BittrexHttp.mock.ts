import { ImportMock } from 'ts-mock-imports'

import * as BittrexHttpMod from './BittrexHttp'



export const mockBittrexHttp = () => {

  const mockManager = ImportMock.mockClass(BittrexHttpMod, 'BittrexHttp')

  return {
    mockManager,
  }

}
