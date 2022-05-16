import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { PoloniexOrderSideEnum } from '../PoloniexOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  PoloniexOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [PoloniexOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [PoloniexOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToPoloniex = buildAdapter<
  AlunaOrderSideEnum,
  PoloniexOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: PoloniexOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: PoloniexOrderSideEnum.SELL,
  },
})
