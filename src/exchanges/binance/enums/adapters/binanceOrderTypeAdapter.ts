import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { binanceOrderTypeEnum } from '../binanceOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  binanceOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [binanceOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [binanceOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [binanceOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [binanceOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeTobinance = buildAdapter<
  AlunaOrderTypesEnum,
  binanceOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: binanceOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: binanceOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: binanceOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: binanceOrderTypeEnum.CEILING_MARKET,
  },
})
