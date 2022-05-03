import { AlunaAccountEnum } from '../../../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../../../IAuthedParams'



export const placeMarketOrder = async (
  params: IAuthedParams,
) => {

  const {
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const {
    symbolPair,
    orderAccount,
    orderAmount,
  } = exchangeConfigs

  return exchangeAuthed.order.place({
    symbolPair,
    account: orderAccount || AlunaAccountEnum.EXCHANGE,
    amount: orderAmount,
    side: AlunaOrderSideEnum.BUY,
    type: AlunaOrderTypesEnum.MARKET,
  })

}
