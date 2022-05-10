import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { binanceOrderSideEnum } from '../binanceOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  binanceOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [binanceOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [binanceOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideTobinance = buildAdapter<
  AlunaOrderSideEnum,
  binanceOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: binanceOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: binanceOrderSideEnum.SELL,
  },
})
