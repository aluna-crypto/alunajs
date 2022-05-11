import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BinanceOrderSideEnum } from '../BinanceOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  BinanceOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [BinanceOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [BinanceOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToBinance = buildAdapter<
  AlunaOrderSideEnum,
  BinanceOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: BinanceOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: BinanceOrderSideEnum.SELL,
  },
})
