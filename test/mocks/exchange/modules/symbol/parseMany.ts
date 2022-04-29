import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaSymbolParseManyReturns } from '../../../../../src/lib/modules/public/IAlunaSymbolModule'



export const mockSymbolParseMany = (
  params: {
    module: any
    returns: IAlunaSymbolParseManyReturns
  },
) => {

  const {
    module,
    returns,
  } = params

  const parseMany = stub().returns(returns)

  const wrapper = ImportMock.mockFunction(
    module,
    'parseMany',
    parseMany,
  )

  return {
    parseMany,
    wrapper,
  }

}
