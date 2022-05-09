import { ImportMock } from 'ts-mock-imports'

import * as placeMarketOrderToClosePositionMod from './placeMarketOrderToClosePosition'



export const mockPlaceMarketOrderToClosePosition = () => {

  const placeMarketOrderToClosePosition = ImportMock.mockFunction(
    placeMarketOrderToClosePositionMod,
    'placeMarketOrderToClosePosition',
  )

  return { placeMarketOrderToClosePosition }

}
