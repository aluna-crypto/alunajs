import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../../IAuthedParams'



export interface IPlaceMarketOrderParams {
  authed: IAuthedParams
  side: AlunaOrderSideEnum
}

export const placeMarketOrder = async (
  params: IPlaceMarketOrderParams,
) => {

  const {
    side,
    authed,
  } = params


  const {
    exchangeConfigs: {
      symbolPair,
      orderAccount,
      orderAmount,
    },
  } = authed

  return authed.exchangeAuthed.order.place({
    symbolPair,
    account: orderAccount || AlunaAccountEnum.EXCHANGE,
    amount: orderAmount,
    side,
    type: AlunaOrderTypesEnum.MARKET,
  })

}
