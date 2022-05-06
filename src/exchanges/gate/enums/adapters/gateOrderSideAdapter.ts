import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { GateOrderSideEnum } from '../GateOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  GateOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [GateOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [GateOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToGate = buildAdapter<
  AlunaOrderSideEnum,
  GateOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: GateOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: GateOrderSideEnum.SELL,
  },
})
