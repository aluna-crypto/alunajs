import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { BitfinexOrderStatusEnum } from '../BitfinexOrderStatusEnum'



export class BitfinexOrderStatusAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Order status'


  /**
   * There is no way to make a conversion from Bitfinex to Al;una using the
   * 'buildAdapter' approach
   */
  static translateToAluna (params:{
    from: string,
  }) {

    const { from } = params

    switch (true) {

      case /^active/i.test(from):
        return AlunaOrderStatusEnum.OPEN

      case /^executed/i.test(from):
        return AlunaOrderStatusEnum.FILLED

      case /^partially/i.test(from):
      case /^insufficient.+partially/i.test(from):
      case /^canceled.+partially/i.test(from): // not sure about this one
        return AlunaOrderStatusEnum.PARTIALLY_FILLED

      case /canceled/i.test(from):
        return AlunaOrderStatusEnum.CANCELED

      default: {

        const message = `${BitfinexOrderStatusAdapter.ERROR_MESSAGE_PREFIX}`
          .concat(` not supported: ${from}`)

        throw new AlunaError({
          message,
          code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
        })

      }

    }

  }

  static translateToBitfinex =
    buildAdapter<AlunaOrderStatusEnum, BitfinexOrderStatusEnum>({
      errorMessagePrefix: BitfinexOrderStatusAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderStatusEnum.OPEN]: BitfinexOrderStatusEnum.ACTIVE,
        [AlunaOrderStatusEnum.FILLED]: BitfinexOrderStatusEnum.EXECUTED,
        [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
          BitfinexOrderStatusEnum.PARTIALLY_FILLED,
        [AlunaOrderStatusEnum.CANCELED]: BitfinexOrderStatusEnum.CANCELED,
      },
    })

}
