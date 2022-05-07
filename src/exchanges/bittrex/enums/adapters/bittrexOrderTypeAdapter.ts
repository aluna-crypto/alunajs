import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BittrexOrderTypeEnum } from '../BittrexOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  BittrexOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [BittrexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BittrexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BittrexOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [BittrexOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToBittrex = buildAdapter<
  AlunaOrderTypesEnum,
  BittrexOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: BittrexOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: BittrexOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: BittrexOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: BittrexOrderTypeEnum.CEILING_MARKET,
  },
})
