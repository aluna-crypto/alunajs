import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketParseManyReturns } from '../../../../../src/lib/modules/public/IAlunaMarketModule'



export const mockMarketParseMany = (
  params: {
    module: any,
    returns: IAlunaMarketParseManyReturns,
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
