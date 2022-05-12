import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BitmexOrderSideEnum } from '../BitmexOrderSideEnum'



const errorMessagePrefix = 'Side'



export const translateOrderSideToAluna = buildAdapter<BitmexOrderSideEnum, AlunaOrderSideEnum>({
  errorMessagePrefix,
  mappings: {
    [BitmexOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
    [BitmexOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
  },
})


export const translateOrderSideToBitmex = buildAdapter<AlunaOrderSideEnum, BitmexOrderSideEnum>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderSideEnum.BUY]: BitmexOrderSideEnum.BUY,
    [AlunaOrderSideEnum.SELL]: BitmexOrderSideEnum.SELL,
  },
})
