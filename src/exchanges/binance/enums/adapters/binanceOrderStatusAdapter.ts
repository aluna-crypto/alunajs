import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BinanceOrderStatusEnum } from '../BinanceOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = buildAdapter<
  BinanceOrderStatusEnum,
  AlunaOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [BinanceOrderStatusEnum.NEW]: AlunaOrderStatusEnum.OPEN,
    [BinanceOrderStatusEnum.PARTIALLY_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
    [BinanceOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
    [BinanceOrderStatusEnum.REJECTED]: AlunaOrderStatusEnum.CANCELED,
    [BinanceOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
    [BinanceOrderStatusEnum.EXPIRED]: AlunaOrderStatusEnum.CANCELED,
  },
})



export const translateOrderStatusToBinance = buildAdapter<
  AlunaOrderStatusEnum,
  BinanceOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: BinanceOrderStatusEnum.NEW,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          BinanceOrderStatusEnum.PARTIALLY_FILLED,
    [AlunaOrderStatusEnum.FILLED]: BinanceOrderStatusEnum.FILLED,
    [AlunaOrderStatusEnum.CANCELED]: BinanceOrderStatusEnum.CANCELED,
  },
})
