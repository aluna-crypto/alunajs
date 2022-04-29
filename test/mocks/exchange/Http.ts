import {
  each,
  flatten,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import {
  IAlunaHttp,
  IAlunaHttpRequestCount,
} from '../../../src/lib/core/IAlunaHttp'



export const mockHttp = <A = any, P = any>(params: {
  classPrototype: IAlunaHttp,
  returns: {
    authedRequest?: Promise<A> | Promise<A | any>[],
    publicRequest?: Promise<P> | Promise<P | any>[],
  },
}) => {

  const {
    classPrototype,
    returns,
  } = params

  const {
    authedRequest: returnsAuthedRequest = {},
    publicRequest: returnsPublicRequest = {},
  } = returns

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

  each(flatten([returnsAuthedRequest]), (returns, index) => {

    authedRequest.onCall(index).returns(returns)

  })

  each(flatten([returnsPublicRequest]), (returns, index) => {

    publicRequest.onCall(index).returns(returns)

  })

  return {
    requestCount,
    authedRequest,
    publicRequest,
  }

}
