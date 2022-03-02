import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaHttp } from '../../../src/lib/core/IAlunaHttp'



export const mockPublicHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
}): { requestMock: Sinon.SinonStub } => {

  const {
    exchangeHttp,
    requestResponse = Promise.resolve(true),
  } = params

  const requestMock = ImportMock.mockFunction(
    exchangeHttp,
    'publicRequest',
    Promise.resolve(requestResponse),
  )

  return { requestMock }

}



export const mockPrivateHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
}): { requestMock: Sinon.SinonStub } => {

  const {
    exchangeHttp,
    requestResponse = Promise.resolve(true),
  } = params

  const requestMock = ImportMock.mockFunction(
    exchangeHttp,
    'privateRequest',
    Promise.resolve(requestResponse),
  )

  return { requestMock }

}
