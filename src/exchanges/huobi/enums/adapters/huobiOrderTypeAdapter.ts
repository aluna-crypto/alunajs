import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  HuobiOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [HuobiOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [HuobiOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToHuobi = buildAdapter<
  AlunaOrderTypesEnum,
  HuobiOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: HuobiOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: HuobiOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: HuobiOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: HuobiOrderTypeEnum.CEILING_MARKET,
  },
})
