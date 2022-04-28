import {
  each,
  flatten,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { BittrexHttp } from '../../src/exchanges/bittrex/BittrexHttp'
import { IAlunaHttpRequestCount } from '../../src/lib/core/IAlunaHttp'



export const mockBittrexHttp = <A = any, P = any>(params: {
  returns: {
    authedRequest?: Promise<A> | Promise<A | any>[],
    publicRequest?: Promise<P> | Promise<P | any>[],
  },
}) => {

  const {
    authedRequest: returnsAuthedRequest = {},
    publicRequest: returnsPublicRequest = {},
  } = params.returns

  const authedRequest = ImportMock.mockFunction(
    BittrexHttp.prototype,
    'authedRequest',
  )

  const publicRequest = ImportMock.mockFunction(
    BittrexHttp.prototype,
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
