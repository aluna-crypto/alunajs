import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../../IAuthedParams'



export const placeLimitOrder = async (
  params: IAuthedParams,
) => {


  const {
    exchangeAuthed,
    exchangeConfigs: {
      symbolPair,
      orderAccount,
      orderAmount,
      orderRate,
    },
  } = params

  return exchangeAuthed.order.place({
    symbolPair,
    account: orderAccount || AlunaAccountEnum.SPOT,
    amount: orderAmount,
    side: AlunaOrderSideEnum.BUY,
    rate: orderRate,
    type: AlunaOrderTypesEnum.LIMIT,
  })

}
