import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { PoloniexOrderTypeEnum } from '../PoloniexOrderTypeEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  PoloniexOrderTypeEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [PoloniexOrderTypeEnum.BUY]: AlunaOrderSideEnum.BUY,
    [PoloniexOrderTypeEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToPoloniex = buildAdapter<
  AlunaOrderSideEnum,
  PoloniexOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: PoloniexOrderTypeEnum.BUY,
    [AlunaOrderSideEnum.SELL]: PoloniexOrderTypeEnum.SELL,
  },
})
