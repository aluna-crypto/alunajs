import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'



export class HuobiOrderSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna =
    buildAdapter<HuobiOrderSideEnum, AlunaOrderSideEnum>({
      errorMessagePrefix: HuobiOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [HuobiOrderSideEnum.BUY]: AlunaOrderSideEnum.BUY,
        [HuobiOrderSideEnum.SELL]: AlunaOrderSideEnum.SELL,
      },
    })



  static translateToHuobi =
    buildAdapter<AlunaOrderSideEnum, HuobiOrderSideEnum>({
      errorMessagePrefix: HuobiOrderSideAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderSideEnum.BUY]: HuobiOrderSideEnum.BUY,
        [AlunaOrderSideEnum.SELL]: HuobiOrderSideEnum.SELL,
      },
    })



}
