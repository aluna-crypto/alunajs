import { ImportMock } from 'ts-mock-imports'

import * as parseHuobiConditionalOrderMod from './parseHuobiConditionalOrder'



export const mockParseHuobiConditionalOrder = () => {

  const parseHuobiConditionalOrder = ImportMock.mockFunction(
    parseHuobiConditionalOrderMod,
    'parseHuobiConditionalOrder',
  )

  return { parseHuobiConditionalOrder }

}
