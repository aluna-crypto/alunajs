import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitfinexOrderSideEnum } from '../BitfinexOderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  BitfinexOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [BitfinexOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [BitfinexOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToBitfinex = buildAdapter<
  AlunaOrderSideEnum,
  BitfinexOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: BitfinexOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: BitfinexOrderSideEnum.SELL,
  },
})
