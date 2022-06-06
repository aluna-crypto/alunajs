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
    [HuobiOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.STOP_MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
    [HuobiOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [HuobiOrderTypeEnum.LIMIT_MAKER]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [HuobiOrderTypeEnum.LIMIT_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
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
    [AlunaOrderTypesEnum.STOP_LIMIT]: HuobiOrderTypeEnum.STOP_LIMIT,
    [AlunaOrderTypesEnum.STOP_MARKET]: HuobiOrderTypeEnum.STOP_MARKET,
    [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]: HuobiOrderTypeEnum.IOC,
    [AlunaOrderTypesEnum.FILL_OF_KILL]: HuobiOrderTypeEnum.LIMIT_FOK,
  },
})
