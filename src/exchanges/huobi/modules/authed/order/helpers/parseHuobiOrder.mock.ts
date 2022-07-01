import { ImportMock } from 'ts-mock-imports'

import * as parseHuobiOrderMod from './parseHuobiOrder'



export const mockParseHuobiOrder = () => {

  const parseHuobiOrder = ImportMock.mockFunction(
    parseHuobiOrderMod,
    'parseHuobiOrder',
  )

  return { parseHuobiOrder }

}
