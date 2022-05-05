import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  BitfinexOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [BitfinexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BitfinexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BitfinexOrderTypeEnum.CEILING_LIMIT]:
          AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [BitfinexOrderTypeEnum.CEILING_MARKET]:
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToBitfinex = buildAdapter<
  AlunaOrderTypesEnum,
  BitfinexOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: BitfinexOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: BitfinexOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]:
          BitfinexOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          BitfinexOrderTypeEnum.CEILING_MARKET,
  },
})

