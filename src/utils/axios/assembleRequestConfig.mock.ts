import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import * as mod from './assembleRequestConfig'



export const mockAssembleRequestConfig = () => {

  const assembleRequestConfig = Sinon.spy(
    (params: mod.IAssembleRequestConfigParams) => {

      const { proxySettings: _proxySettings, ...requestConfig } = params

      return { requestConfig }

    },
  )

  ImportMock.mockOther(
    mod,
    'assembleRequestConfig',
    assembleRequestConfig,
  )

  return { assembleRequestConfig }

}
