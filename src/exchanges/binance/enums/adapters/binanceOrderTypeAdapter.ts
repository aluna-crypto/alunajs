import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BinanceOrderTypeEnum } from '../BinanceOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  BinanceOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [BinanceOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BinanceOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BinanceOrderTypeEnum.CEILING_LIMIT]: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [BinanceOrderTypeEnum.CEILING_MARKET]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToBinance = buildAdapter<
  AlunaOrderTypesEnum,
  BinanceOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: BinanceOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: BinanceOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]: BinanceOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]: BinanceOrderTypeEnum.CEILING_MARKET,
  },
})
