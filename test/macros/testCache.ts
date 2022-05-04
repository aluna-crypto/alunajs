import { expect } from 'chai'

import { mockAlunaCache } from '../../src/utils/cache/AlunaCache.mock'
import { mockAxiosRequest } from '../mocks/axios/request'



export interface ITestCacheParams {
  cacheResult: any
  callMethod: () => any
}



export const testCache = async (params: ITestCacheParams) => {

  const {
    callMethod,
    cacheResult,
  } = params



  it('method should write to cache', async () => {

    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(cacheResult))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: false, get: undefined })

    // executing
    await callMethod()

    // validating
    expect(cache.has.callCount).to.eq(1)
    expect(cache.get.callCount).to.eq(0)
    expect(cache.set.callCount).to.eq(1)
    expect(hashCacheKey.callCount).to.eq(1)


  })

  it('method should read from cache', async () => {

    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(cacheResult))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: true, get: cacheResult })


    // executing
    await callMethod()


    // validating
    expect(cache.has.callCount).to.eq(1)
    expect(cache.get.callCount).to.eq(1)
    expect(cache.set.callCount).to.eq(0)
    expect(hashCacheKey.callCount).to.eq(1)
  })

}
