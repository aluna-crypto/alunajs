import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketParseReturns } from '../../../../../src/lib/modules/public/IAlunaMarketModule'



export const mockMarketParse = (
  params: {
    module: any,
    returns: IAlunaMarketParseReturns,
  },
) => {

  const {
    module,
    returns,
  } = params

  const parse = stub().returns(returns)

  const wrapper = ImportMock.mockFunction(
    module,
    'parse',
    parse,
  )

  return {
    parse,
    wrapper,
  }

}
