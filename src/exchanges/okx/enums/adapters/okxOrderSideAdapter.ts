import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { OkxOrderSideEnum } from '../OkxOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  OkxOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [OkxOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [OkxOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToOkx = buildAdapter<
  AlunaOrderSideEnum,
  OkxOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: OkxOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: OkxOrderSideEnum.SELL,
  },
})
