import {
  ImportMock,
  OtherManager,
} from 'ts-mock-imports'

import { IAlunaExchange } from '../../../src/lib/core/IAlunaExchange'
import { IAlunaModule } from '../../../src/lib/core/IAlunaModule'
import { IAlunaKeySecretSchema } from '../../../src/lib/schemas/IAlunaKeySecretSchema'



export interface IMockExchangeModuleResponse {
  exchangeMock: OtherManager<IAlunaExchange>
}



export const mockExchangeModule = (params: {
  module: IAlunaModule,
  overrides?: Partial<IAlunaExchange>,
}): IMockExchangeModuleResponse => {

  const {
    module,
    overrides = {},
  } = params

  const keySecret: IAlunaKeySecretSchema = {
    key: '',
    secret: '',
  }

  const exchangeMock = ImportMock.mockOther(
    module,
    'exchange',
    {
      keySecret,
      ...overrides,
    },
  )

  return { exchangeMock }

}
