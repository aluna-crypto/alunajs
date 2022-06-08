import { ImportMock } from 'ts-mock-imports'

import * as getFtxOrdinaryOrderMod from './getFtxOrdinaryOrder'



export const mockGetFtxOrdinaryOrder = () => {

  const getFtxOrdinaryOrder = ImportMock.mockFunction(
    getFtxOrdinaryOrderMod,
    'getFtxOrdinaryOrder',
  )

  return { getFtxOrdinaryOrder }

}
