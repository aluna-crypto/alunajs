import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { BitmexOrderSideEnum } from '../BitmexOrderSideEnum'



const errorMessagePrefix = 'Side'



export const translatePositionSideToAluna = (params: {
    homeNotional: number
  }): AlunaPositionSideEnum => {

  const { homeNotional } = params

  if (homeNotional < 0) {

    return AlunaPositionSideEnum.SHORT

  }

  return AlunaPositionSideEnum.LONG

}



export const translatePositionSideToBitmex = buildAdapter<AlunaPositionSideEnum, BitmexOrderSideEnum>({
  errorMessagePrefix,
  mappings: {
    [AlunaPositionSideEnum.LONG]: BitmexOrderSideEnum.BUY,
    [AlunaPositionSideEnum.SHORT]: BitmexOrderSideEnum.SELL,
  },
})
