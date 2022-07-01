import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaGenericErrorCodes } from '../../../../lib/errors/AlunaGenericErrorCodes'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'



const errorMessagePrefix = 'Order side'

const mappings = {
  [HuobiOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
  [HuobiOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
}



export const translateOrderSideToAluna = (params: {
  orderSide?: HuobiOrderSideEnum
  type?: HuobiOrderTypeEnum
}) => {


  const {
    type,
    orderSide,
  } = params

  if (!type && !orderSide) {

    throw new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'At least one of the params are required for translating Huobi order side',
    })

  }

  let side: AlunaOrderSideEnum

  if (orderSide) {

    side = mappings[orderSide]

  } else {

    side = type!.split(/-/)[0] as AlunaOrderSideEnum

  }

  return side

}



export const translateOrderSideToHuobi = buildAdapter<
  AlunaOrderSideEnum,
  HuobiOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: HuobiOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: HuobiOrderSideEnum.SELL,
  },
})
