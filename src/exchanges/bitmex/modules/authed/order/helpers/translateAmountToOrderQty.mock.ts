import { ImportMock } from 'ts-mock-imports'

import * as translateAmountToOrderQtyMod from './translateAmountToOrderQty'



export const mockTranslateAmountToOrderQty = () => {

  const translateAmountToOrderQty = ImportMock.mockFunction(
    translateAmountToOrderQtyMod,
    'translateAmountToOrderQty',
  )

  return { translateAmountToOrderQty }

}
