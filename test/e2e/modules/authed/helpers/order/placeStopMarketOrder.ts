import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../../IAuthedParams'



export const placeStopMarketOrder = async (
  params: IAuthedParams,
) => {


  const {
    exchangeAuthed,
    exchangeConfigs: {
      symbolPair,
      orderAccount,
      orderAmount,
      orderStopRate,
    },
  } = params

  return exchangeAuthed.order.place({
    symbolPair,
    account: orderAccount || AlunaAccountEnum.SPOT,
    amount: orderAmount,
    side: AlunaOrderSideEnum.BUY,
    stopRate: orderStopRate,
    type: AlunaOrderTypesEnum.STOP_MARKET,
  })

}
