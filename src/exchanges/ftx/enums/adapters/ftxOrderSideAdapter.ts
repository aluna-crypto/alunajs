import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { FtxOrderSideEnum } from '../FtxOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  FtxOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [FtxOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [FtxOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToFtx = buildAdapter<
  AlunaOrderSideEnum,
  FtxOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: FtxOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: FtxOrderSideEnum.SELL,
  },
})
