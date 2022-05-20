import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../../IAuthedParams'



export interface IPlaceLimitOrderParams {
  authedParams: IAuthedParams
  insufficientBalanceAmount?: boolean
}


export const placeLimitOrder = async (
  params: IPlaceLimitOrderParams,
) => {

  const {
    authedParams,
    insufficientBalanceAmount,
  } = params

  const {
    exchangeAuthed,
    exchangeConfigs: {
      symbolPair,
      orderAccount,
      orderAmount,
      orderRate,
      orderInsufficientAmount,
    },
  } = authedParams

  const amount = insufficientBalanceAmount
    ? orderInsufficientAmount
    : orderAmount

  return exchangeAuthed.order.place({
    symbolPair,
    account: orderAccount || AlunaAccountEnum.SPOT,
    amount,
    side: AlunaOrderSideEnum.BUY,
    rate: orderRate,
    type: AlunaOrderTypesEnum.LIMIT,
  })

}
