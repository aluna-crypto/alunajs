import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  HuobiOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [HuobiOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



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
