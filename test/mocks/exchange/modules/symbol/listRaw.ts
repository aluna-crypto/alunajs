import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaSymbolListRawReturns } from '../../../../../src/lib/modules/public/IAlunaSymbolModule'



export const mockSymbolListRaw = <T>(
  params: {
    module: any,
    returns: IAlunaSymbolListRawReturns<T>,
  },
) => {

  const {
    module,
    returns,
  } = params

  const listRaw = stub().returns(Promise.resolve(returns))

  const wrapper = ImportMock.mockFunction(
    module,
    'listRaw',
    listRaw,
  )

  return {
    listRaw,
    wrapper,
  }

}
