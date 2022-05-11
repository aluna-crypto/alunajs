import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitmexOrderTypeEnum } from '../BitmexOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  BitmexOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [BitmexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BitmexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BitmexOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [BitmexOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToBitmex = buildAdapter<
  AlunaOrderTypesEnum,
  BitmexOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: BitmexOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: BitmexOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: BitmexOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: BitmexOrderTypeEnum.CEILING_MARKET,
  },
})
