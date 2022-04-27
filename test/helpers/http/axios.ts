import axios from 'axios'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaHttp } from '../../../src/lib/core/IAlunaHttp'



export const mockPublicHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
  isReject?: boolean,
}) => {

  const {
    exchangeHttp,
    requestResponse = Promise.resolve(true),
    isReject = false,
  } = params

  const publicRequest = ImportMock.mockFunction(
    exchangeHttp,
    'publicRequest',
    isReject
      ? requestResponse
      : Promise.resolve({
        data: requestResponse,
        requestCount: 1,
      }),
  )

  return { publicRequest }

}



export const mockPrivateHttpRequest = (params: {
  exchangeHttp: IAlunaHttp,
  requestResponse?: any,
  isReject?: boolean,
}) => {

  const {
    exchangeHttp,
    requestResponse = true,
    isReject = false,
  } = params

  const authedRequest = ImportMock.mockFunction(
    exchangeHttp,
    'authedRequest',
    isReject
      ? requestResponse
      : Promise.resolve({
        data: requestResponse,
        requestCount: 1,
      }),
  )

  return { authedRequest }

}



export const mockAxiosRequest = (
  params: {
    responseData?: any,
    error?: any,
  } = { responseData: {} },
) => {

  const {
    error,
    responseData,
  } = params

  let request: any

  if (error) {

    request = Sinon.spy(async () => Promise.reject(error))

  } else {

    request = Sinon.spy(async () => Promise.resolve({ data: responseData }))

  }

  const create = ImportMock.mockFunction(
    axios,
    'create',
    { request },
  )

  return {
    request,
    create,
  }

}
