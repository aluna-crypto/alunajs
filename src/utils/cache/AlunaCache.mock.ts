import { expect } from 'chai'
import { spy } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { mochaHooks } from '../../../test/mocha/hooks'
import { AlunaCache } from './AlunaCache'



/**
 * Mocking utils
 */
export const mockAlunaCache = (
  returns?: {
  get?: any,
  set?: boolean,
  has?: boolean,
},
) => {

  const {
    get = {},
    set = true,
    has = false,
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



/**
 * Validation utils
 */
export interface IValidateCacheParams {
  cacheResult: any
  callMethod: () => any
}



export const validateCache = async (params: IValidateCacheParams) => {

  await validateWriteToCache(params)

  mochaHooks.beforeEach()

  await validateReadFromCache(params)

}



export const validateWriteToCache = async (params: IValidateCacheParams) => {

  const {
    callMethod,
  } = params

  const {
    cache,
    hashCacheKey,
  } = mockAlunaCache({ has: false, get: undefined })

  await callMethod()

  expect(cache.has.callCount).to.eq(1)
  expect(cache.get.callCount).to.eq(0)
  expect(cache.set.callCount).to.eq(1)
  expect(hashCacheKey.callCount).to.eq(1)

}



export const validateReadFromCache = async (params: IValidateCacheParams) => {

  const {
    callMethod,
    cacheResult,
  } = params

  const {
    cache,
    hashCacheKey,
  } = mockAlunaCache({ has: true, get: cacheResult })

  await callMethod()

  expect(cache.has.callCount).to.eq(1)
  expect(cache.get.callCount).to.eq(1)
  expect(cache.set.callCount).to.eq(0)
  expect(hashCacheKey.callCount).to.eq(1)

}
