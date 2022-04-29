import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketListRawReturns } from '../../../../../src/lib/modules/public/IAlunaMarketModule'



export const mockMarketListRaw = <T>(
  params: {
    module: any,
    returns: IAlunaMarketListRawReturns<T>,
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
