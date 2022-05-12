import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  PoloniexOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [PoloniexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [PoloniexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [PoloniexOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [PoloniexOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToPoloniex = buildAdapter<
  AlunaOrderTypesEnum,
  PoloniexOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: PoloniexOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: PoloniexOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: PoloniexOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: PoloniexOrderTypeEnum.CEILING_MARKET,
  },
})
