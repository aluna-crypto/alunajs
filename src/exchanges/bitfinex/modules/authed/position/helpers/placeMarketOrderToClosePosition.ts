import { IAlunaExchangeAuthed } from '../../../../../../lib/core/IAlunaExchange'
import { IAlunaHttp } from '../../../../../../lib/core/IAlunaHttp'
import { AlunaOrderSideEnum } from '../../../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaPositionSideEnum } from '../../../../../../lib/enums/AlunaPositionSideEnum'
import { IAlunaPositionSchema } from '../../../../../../lib/schemas/IAlunaPositionSchema'



export const placeMarketOrderToClosePosition = async (params: {
  http: IAlunaHttp
  exchange: IAlunaExchangeAuthed
  position: IAlunaPositionSchema
}) => {

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

  await exchange.order.place({
    http,
    account,
    side: invertedOrderSide,
    amount,
    symbolPair,
    type: AlunaOrderTypesEnum.MARKET,
  })

}
