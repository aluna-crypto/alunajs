import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BittrexSideEnum } from '../BittrexSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  BittrexSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [BittrexSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [BittrexSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToBittrex = buildAdapter<
  AlunaOrderSideEnum,
  BittrexSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: BittrexSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: BittrexSideEnum.SELL,
  },
})

