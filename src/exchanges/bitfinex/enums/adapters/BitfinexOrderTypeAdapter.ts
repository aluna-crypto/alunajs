import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypesEnum } from '../BitfinexOrderTypesEnum'



export class BitfinexOrderTypeAdapter {

  static readonly ERROR_MESSAGE_PREFIX = 'Order type'

  static translateToAluna =
    buildAdapter<BitfinexOrderTypesEnum, AlunaOrderTypesEnum>({
      errorMessagePrefix: BitfinexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [BitfinexOrderTypesEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [BitfinexOrderTypesEnum.EXCHANGE_LIMIT]: AlunaOrderTypesEnum.LIMIT,
        [BitfinexOrderTypesEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
        [BitfinexOrderTypesEnum.EXCHANGE_MARKET]: AlunaOrderTypesEnum.MARKET,
        [BitfinexOrderTypesEnum.STOP]: AlunaOrderTypesEnum.STOP_MARKET,
        [BitfinexOrderTypesEnum.EXCHANGE_STOP]: AlunaOrderTypesEnum.STOP_MARKET,
        [BitfinexOrderTypesEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
        [BitfinexOrderTypesEnum.EXCHANGE_STOP_LIMIT]:
          AlunaOrderTypesEnum.STOP_LIMIT,
        [BitfinexOrderTypesEnum.FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
        [BitfinexOrderTypesEnum.EXCHANGE_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
        [BitfinexOrderTypesEnum.IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
        [BitfinexOrderTypesEnum.EXCHANGE_IOC]:
          AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
        [BitfinexOrderTypesEnum.TRAILING_STOP]:
          AlunaOrderTypesEnum.TRAILING_STOP,
        [BitfinexOrderTypesEnum.EXCHANGE_TRAILING_STOP]:
          AlunaOrderTypesEnum.TRAILING_STOP,
      },
    })


  /**
   * There is no way to make a precise conversion from Aluna to Bitfinex using
   * the 'buildAdapter' approach because the Aluna order type lacks the order
   * account type information.
   */
  static translateToBitfinex =
    buildAdapter<AlunaOrderTypesEnum, BitfinexOrderTypesEnum>({
      errorMessagePrefix: BitfinexOrderTypeAdapter.ERROR_MESSAGE_PREFIX,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: BitfinexOrderTypesEnum.LIMIT,
        [AlunaOrderTypesEnum.MARKET]: BitfinexOrderTypesEnum.MARKET,
        [AlunaOrderTypesEnum.STOP_MARKET]: BitfinexOrderTypesEnum.STOP,
        [AlunaOrderTypesEnum.STOP_LIMIT]:
          BitfinexOrderTypesEnum.STOP_LIMIT,
        [AlunaOrderTypesEnum.FILL_OF_KILL]:
          BitfinexOrderTypesEnum.FOK,
        [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]:
          BitfinexOrderTypesEnum.IOC,
      },
    })

}
