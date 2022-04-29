import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaSymbolParseReturns } from '../../../../../src/lib/modules/public/IAlunaSymbolModule'



export const mockSymbolParse = (
  params: {
    module: any
    returns: IAlunaSymbolParseReturns
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
