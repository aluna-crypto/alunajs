import { ImportMock } from 'ts-mock-imports'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../src/lib/core/IAlunaHttp'



export function mockHttp (params: {
  classPrototype: IAlunaHttp,
}) {

  const {
    classPrototype,
  } = params

  const authedRequest = ImportMock.mockFunction(
    classPrototype,
    'authedRequest',
  )

  const publicRequest = ImportMock.mockFunction(
    classPrototype,
    'publicRequest',
  )

  const requestCount: IAlunaHttpRequestCount = {
    authed: 0,
    public: 0,
  }

  return {
    requestCount,
    authedRequest,
    publicRequest,
  }

}
