import { ImportMock } from 'ts-mock-imports'

import * as getFtxTriggerOrderMod from './getFtxTriggerOrder'



export const mockGetFtxTriggerOrder = () => {

  const getFtxTriggerOrder = ImportMock.mockFunction(
    getFtxTriggerOrderMod,
    'getFtxTriggerOrder',
  )

  return { getFtxTriggerOrder }

}
