import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BittrexOrderSideEnum } from '../BittrexOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  BittrexOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [BittrexOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [BittrexOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToBittrex = buildAdapter<
  AlunaOrderSideEnum,
  BittrexOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: BittrexOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: BittrexOrderSideEnum.SELL,
  },
})
