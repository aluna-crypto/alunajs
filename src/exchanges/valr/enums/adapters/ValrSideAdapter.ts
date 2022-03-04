import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { ValrSideEnum } from '../ValrSideEnum'



export class ValrSideAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Order side'

  static translateToAluna = buildAdapter<ValrSideEnum, AlunaOrderSideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [ValrSideEnum.BUY]: AlunaOrderSideEnum.BUY,
      [ValrSideEnum.SELL]: AlunaOrderSideEnum.SELL,
    },
  })

  static translateToValr = buildAdapter<AlunaOrderSideEnum, ValrSideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [AlunaOrderSideEnum.BUY]: ValrSideEnum.BUY,
      [AlunaOrderSideEnum.SELL]: ValrSideEnum.SELL,
    },
  })

}
