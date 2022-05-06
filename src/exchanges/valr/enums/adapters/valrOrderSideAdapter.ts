import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { ValrOrderSideEnum } from '../ValrOrderSideEnum'



const errorMessagePrefix = 'Order side'



export const translateOrderSideToAluna = buildAdapter<
  ValrOrderSideEnum,
  AlunaOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [ValrOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [ValrOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})



export const translateOrderSideToValr = buildAdapter<
  AlunaOrderSideEnum,
  ValrOrderSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: ValrOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: ValrOrderSideEnum.SELL,
  },
})
