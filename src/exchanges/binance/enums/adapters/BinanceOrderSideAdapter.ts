import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { BinanceSideEnum } from '../BinanceSideEnum'



export class BinanceOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<BinanceSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: BinanceOrderSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [BinanceSideEnum.BUY]: AlunaOrderSideEnum.BUY,
      [BinanceSideEnum.SELL]: AlunaOrderSideEnum.SELL,
    },
  })



  static translateToBinance =
    buildAdapter<AlunaOrderSideEnum, BinanceSideEnum>({
      errorMessagePrefix: BinanceOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderSideEnum.BUY]: BinanceSideEnum.BUY,
        [AlunaOrderSideEnum.SELL]: BinanceSideEnum.SELL,
      },
    })



}