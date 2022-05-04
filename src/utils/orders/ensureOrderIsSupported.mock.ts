import { ImportMock } from 'ts-mock-imports'

import * as ensureOrderIsSupportedMod from './ensureOrderIsSupported'



export const mockEnsureOrderIsSupported = () => {

  const ensureOrderIsSupported = ImportMock.mockFunction(
    ensureOrderIsSupportedMod,
    'ensureOrderIsSupported',
  )

  return { ensureOrderIsSupported }

}
