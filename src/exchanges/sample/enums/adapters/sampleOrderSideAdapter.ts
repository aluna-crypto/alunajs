import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { SampleSideEnum } from '../SampleSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  SampleSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [SampleSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [SampleSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToSample = buildAdapter<
  AlunaOrderSideEnum,
  SampleSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: SampleSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: SampleSideEnum.SELL,
  },
})

