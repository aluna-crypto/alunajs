import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BinanceOrderStatusEnum } from '../BinanceOrderStatusEnum'



export class BinanceStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<BinanceOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: BinanceStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BinanceOrderStatusEnum.NEW]: AlunaOrderStatusEnum.OPEN,
        [BinanceOrderStatusEnum.PARTIALLY_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [BinanceOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        [BinanceOrderStatusEnum.REJECTED]: AlunaOrderStatusEnum.CANCELED,
        [BinanceOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
        [BinanceOrderStatusEnum.EXPIRED]: AlunaOrderStatusEnum.CANCELED,
      },
    })



  static translateToBinance =
    buildAdapter<AlunaOrderStatusEnum, BinanceOrderStatusEnum>({
      errorMessagePrefix: BinanceStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: BinanceOrderStatusEnum.NEW,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          BinanceOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.FILLED]: BinanceOrderStatusEnum.FILLED,
        [AlunaOrderStatusEnum.CANCELED]: BinanceOrderStatusEnum.CANCELED,
      },
    })



}

