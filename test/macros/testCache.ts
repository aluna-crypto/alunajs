import { expect } from 'chai'

import { IAlunaHttpPublicParams } from '../../src/lib/core/IAlunaHttp'
import { AlunaHttpVerbEnum } from '../../src/lib/enums/AlunaHtttpVerbEnum'
import { mockAlunaCache } from '../../src/utils/cache/AlunaCache.mock'
import { mockAxiosRequest } from '../mocks/axios/request'
import { TExchangeHttpConstructor } from './testPlaceOrder'



export interface ITestCacheParams {
  HttpClass: TExchangeHttpConstructor
  useObjectAsResponse?: boolean
}



export const testCache = async (params: ITestCacheParams) => {

  const {
    HttpClass,
    useObjectAsResponse = false,
  } = params

  const requestParams: IAlunaHttpPublicParams = {
    url: 'http://someurl',
    body: {},
    verb: AlunaHttpVerbEnum.GET,
  }

  const response = useObjectAsResponse
    ? { data: 'mocked response' }
    : 'mocked response'



  it('method should write to cache', async () => {

    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(response))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: false, get: undefined })

    // executing
    await new HttpClass({}).publicRequest(requestParams)

    // validating
    expect(cache.has.callCount).to.eq(1)
    expect(cache.get.callCount).to.eq(0)
    expect(cache.set.callCount).to.eq(1)

    expect(hashCacheKey.callCount).to.eq(1)


  })



  it('method should not read from cache', async () => {

    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(response))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: false, get: response })

    // executing
    await new HttpClass({}).publicRequest(requestParams)

    // validating
    expect(cache.has.callCount).to.eq(1)
    expect(cache.get.callCount).to.eq(0)
    expect(cache.set.callCount).to.eq(1)

    expect(hashCacheKey.callCount).to.eq(1)
  })



  it('method should read from cache', async () => {

    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(response))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: true, get: response })

    // executing
    await new HttpClass({}).publicRequest(requestParams)

    // validating
    expect(cache.has.callCount).to.eq(1)
    expect(cache.get.callCount).to.eq(1)
    expect(cache.set.callCount).to.eq(0)

    expect(hashCacheKey.callCount).to.eq(1)
  })



  it('if cache is disabled, method should never read from it', async () => {

    // preparing data
    const settings = { disableCache: true } // disables cache


    // mocking
    const { request } = mockAxiosRequest()

    request.returns(Promise.resolve(response))

    const {
      cache,
      hashCacheKey,
    } = mockAlunaCache({ has: true, get: response }) // simulate existent cache


    // executing
    await new HttpClass(settings).publicRequest(requestParams)


    // validating — cache methods never touched
    expect(cache.has.callCount).to.eq(0)
    expect(cache.get.callCount).to.eq(0)
    expect(cache.set.callCount).to.eq(0)

    expect(hashCacheKey.callCount).to.eq(1)
  })

}
