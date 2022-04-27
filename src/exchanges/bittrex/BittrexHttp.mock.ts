import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as BittrexHttpMod from './BittrexHttp'



export const mockBittrexHttp = () => {

  const authedRequest = Sinon.stub()
  const publicRequest = Sinon.stub()
  const requestCount = Sinon.stub()

  const http = ImportMock.mockFunction(
    BittrexHttpMod,
    'BittrexHttp',
    {
      authedRequest,
      publicRequest,
      requestCount,
    },
  )

  return {
    http,
    authedRequest,
    publicRequest,
    requestCount,
  }

}
