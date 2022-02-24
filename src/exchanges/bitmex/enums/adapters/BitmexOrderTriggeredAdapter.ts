import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTriggeredStatusEnum } from '../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { BitmexOrderTriggeredStatus } from '../BitmexOrderTriggeredStatus'



export class BitmexOrderTriggeredAdapter {



  static readonly ERROR_MESSAGE_PREFIX = 'Order triggered status'



  static translateToAluna =
    buildAdapter<BitmexOrderTriggeredStatus, AlunaOrderTriggeredStatusEnum>({
      errorMessagePrefix: BitmexOrderTriggeredAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitmexOrderTriggeredStatus.TRIGGERED]:
          AlunaOrderTriggeredStatusEnum.TRIGGERED,
        [BitmexOrderTriggeredStatus.UNTRIGGERED]:
          AlunaOrderTriggeredStatusEnum.UNTRIGGERED,
      },
    })


  static translateToBitmex =
    buildAdapter<AlunaOrderTriggeredStatusEnum, BitmexOrderTriggeredStatus>({
      errorMessagePrefix: BitmexOrderTriggeredAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTriggeredStatusEnum.TRIGGERED]:
          BitmexOrderTriggeredStatus.TRIGGERED,
        [AlunaOrderTriggeredStatusEnum.UNTRIGGERED]:
          BitmexOrderTriggeredStatus.UNTRIGGERED,
      },
    })

}

