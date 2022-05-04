import { spy } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { AlunaCache } from './AlunaCache'



export const mockAlunaCache = (
  returns?: {
    get?: any
    set?: boolean
    has?: boolean
  },
) => {

  const {
    get = {}, set = true, has = false,
  } = returns || {}

  const cache = {
    get: spy(() => get),
    set: spy(() => set),
    has: spy(() => has),
  }

  ImportMock.mockOther(AlunaCache, 'cache', cache)

  const hashCacheKey = ImportMock.mockFunction(
    AlunaCache,
    'hashCacheKey',
    'abc',
  )

  return {
    cache,
    hashCacheKey,
  }

}
