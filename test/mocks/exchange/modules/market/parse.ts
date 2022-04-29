import {
  each,
  flatten,
} from 'lodash'
import { stub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaMarketParseReturns } from '../../../../../src/lib/modules/public/IAlunaMarketModule'



export const mockMarketParse = (
  params: {
    module: any
    returns: IAlunaMarketParseReturns | IAlunaMarketParseReturns[]
  },
) => {

  const {
    module,
    returns,
  } = params

  const parse = stub()

  each(flatten([returns]), (returnItem, index) => {

    parse.onCall(index).returns(returnItem)

  })

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
