import { IAlunaExchangeAuthed } from '../../lib/core/IAlunaExchange'
import { IAlunaHttp } from '../../lib/core/IAlunaHttp'
import { AlunaOrderSideEnum } from '../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaPositionSideEnum } from '../../lib/enums/AlunaPositionSideEnum'
import { IAlunaOrderSchema } from '../../lib/schemas/IAlunaOrderSchema'
import { IAlunaPositionSchema } from '../../lib/schemas/IAlunaPositionSchema'



export interface IPlaceMarketOrderToClosePositionParams {
  http: IAlunaHttp
  exchange: IAlunaExchangeAuthed
  position: IAlunaPositionSchema
}



export interface IPlaceMarketOrderToClosePositionReturns {
  order: IAlunaOrderSchema
}



export const placeMarketOrderToClosePosition = async (
  params: IPlaceMarketOrderToClosePositionParams,
): Promise<IPlaceMarketOrderToClosePositionReturns> => {

  const {
    http,
    exchange,
    position: {
      symbolPair,
      account,
      amount,
      side: positionSide,
    },
  } = params

  const invertedOrderSide = positionSide === AlunaPositionSideEnum.LONG
    ? AlunaOrderSideEnum.SELL
    : AlunaOrderSideEnum.BUY

  const { order } = await exchange.order.place({
    http,
    account,
    side: invertedOrderSide,
    amount,
    symbolPair,
    type: AlunaOrderTypesEnum.MARKET,
  })

  return { order }

}
