import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { BitmexOrderStatusEnum } from '../BitmexOrderStatusEnum'



export class BitmexStatusAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order status'



  static translateToAluna =
    buildAdapter<BitmexOrderStatusEnum, AlunaOrderStatusEnum>({
      errorMessagePrefix: BitmexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitmexOrderStatusEnum.NEW]: AlunaOrderStatusEnum.OPEN,
        [BitmexOrderStatusEnum.PARTIALLY_FILLED]:
          AlunaOrderStatusEnum.PARTIALLY_FILLED,
        [BitmexOrderStatusEnum.FILLED]: AlunaOrderStatusEnum.FILLED,
        [BitmexOrderStatusEnum.CANCELED]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.REJECTED]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.EXPIRED]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.DONE_FOR_DAY]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.PENDING_CANCEL]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.PENDING_NEW]: AlunaOrderStatusEnum.CANCELED,
        [BitmexOrderStatusEnum.STOPPED]: AlunaOrderStatusEnum.CANCELED,
      },
    })


  static translateToBitmex =
    buildAdapter<AlunaOrderStatusEnum, BitmexOrderStatusEnum>({
      errorMessagePrefix: BitmexStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: BitmexOrderStatusEnum.NEW,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          BitmexOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.FILLED]: BitmexOrderStatusEnum.FILLED,
        [AlunaOrderStatusEnum.CANCELED]: BitmexOrderStatusEnum.CANCELED,
      },
    })

}

