import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { SideEnum } from '../../../../lib/enums/SideEnum'
import { ValrSideEnum } from '../ValrSideEnum'



export class ValrSideAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order side'



  static translateToAluna = buildAdapter<ValrSideEnum, SideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [ValrSideEnum.BUY]: SideEnum.LONG,
      [ValrSideEnum.SELL]: SideEnum.SHORT,
    },
  })



  static translateToValr = buildAdapter<SideEnum, ValrSideEnum>({
    errorMessagePrefix: ValrSideAdapter.ERROR_MESSAGE_PREFIX,
    mappings: {
      [SideEnum.LONG]: ValrSideEnum.BUY,
      [SideEnum.SHORT]: ValrSideEnum.SELL,
    },
  })



}
