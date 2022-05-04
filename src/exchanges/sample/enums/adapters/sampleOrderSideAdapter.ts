import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { SampleOrderSideEnum } from '../SampleOderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  SampleOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [SampleOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [SampleOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToSample = buildAdapter<
  AlunaOrderSideEnum,
  SampleOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: SampleOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: SampleOrderSideEnum.SELL,
  },
})
