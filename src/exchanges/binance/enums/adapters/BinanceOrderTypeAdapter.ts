import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BinanceOrderTypeEnum } from '../BinanceOrderTypeEnum'



export class BinanceOrderTypeAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order type'



  static translateToAluna =
    buildAdapter<BinanceOrderTypeEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: BinanceOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BinanceOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [BinanceOrderTypeEnum.STOP_LOSS_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
        [BinanceOrderTypeEnum.STOP_LOSS]: AlunaOrderTypesEnum.STOP_MARKET,
        [BinanceOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
        [BinanceOrderTypeEnum.LIMIT_MAKER]: AlunaOrderTypesEnum.LIMIT,
        [BinanceOrderTypeEnum.TAKE_PROFIT]: 
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
        [BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT]:
          AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
      },
    })



  static translateToBinance =
    buildAdapter<AlunaOrderTypesEnum, BinanceOrderTypeEnum>({
      errorMessagePrefix: BinanceOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: BinanceOrderTypeEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: BinanceOrderTypeEnum.MARKET,
        [AlunaOrderTypesEnum.STOP_LIMIT]: BinanceOrderTypeEnum.STOP_LOSS_LIMIT,
        [AlunaOrderTypesEnum.STOP_MARKET]: BinanceOrderTypeEnum.STOP_LOSS,
        [AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT]:
          BinanceOrderTypeEnum.TAKE_PROFIT_LIMIT,
        [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          BinanceOrderTypeEnum.TAKE_PROFIT,
      },
    })



}
