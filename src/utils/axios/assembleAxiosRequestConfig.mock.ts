import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './assembleAxiosRequestConfig'



export const mockAssembleRequestConfig = () => {

  const assembleAxiosRequestMock = Sinon.spy(
    (params: mod.IAssembleAxiosRequestConfigParams) => {

      const { proxySettings: _proxySettings, ...requestConfig } = params

      return { requestConfig }

    },
  )

  ImportMock.mockOther(
    mod,
    'assembleAxiosRequestConfig',
    assembleAxiosRequestMock,
  )

  return { assembleAxiosRequestMock }

}
