import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaAccountEnum } from '../../../../lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'



const errorMessagePrefix = 'Order type'

export const translateOrderTypeToAluna = buildAdapter<BitfinexOrderTypeEnum, AlunaOrderTypesEnum>({
  errorMessagePrefix,
  mappings: {
    [BitfinexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BitfinexOrderTypeEnum.EXCHANGE_LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BitfinexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BitfinexOrderTypeEnum.EXCHANGE_MARKET]: AlunaOrderTypesEnum.MARKET,
    [BitfinexOrderTypeEnum.STOP]: AlunaOrderTypesEnum.STOP_MARKET,
    [BitfinexOrderTypeEnum.EXCHANGE_STOP]: AlunaOrderTypesEnum.STOP_MARKET,
    [BitfinexOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [BitfinexOrderTypeEnum.EXCHANGE_STOP_LIMIT]:
          AlunaOrderTypesEnum.STOP_LIMIT,
    [BitfinexOrderTypeEnum.FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
    [BitfinexOrderTypeEnum.EXCHANGE_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
    [BitfinexOrderTypeEnum.IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [BitfinexOrderTypeEnum.EXCHANGE_IOC]:
          AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [BitfinexOrderTypeEnum.TRAILING_STOP]:
          AlunaOrderTypesEnum.TRAILING_STOP,
    [BitfinexOrderTypeEnum.EXCHANGE_TRAILING_STOP]:
          AlunaOrderTypesEnum.TRAILING_STOP,
  },
})


/**
   * There is no way to make a precise conversion from Aluna to Bitfinex using
   * the 'buildAdapter' approach because the Aluna order type lacks the order
   * account type information.
   */
export const translateOrderTypeToBitfinex = (params: {
    from: AlunaOrderTypesEnum
    account: AlunaAccountEnum
  }) => {

  const {
    from,
    account,
  } = params

  if (account === AlunaAccountEnum.EXCHANGE) {

    return buildAdapter<AlunaOrderTypesEnum, BitfinexOrderTypeEnum>({
      errorMessagePrefix,
      mappings: {
        [AlunaOrderTypesEnum.LIMIT]: BitfinexOrderTypeEnum.EXCHANGE_LIMIT,
        [AlunaOrderTypesEnum.MARKET]: BitfinexOrderTypeEnum.EXCHANGE_MARKET,
        [AlunaOrderTypesEnum.STOP_MARKET]:
            BitfinexOrderTypeEnum.EXCHANGE_STOP,
        [AlunaOrderTypesEnum.STOP_LIMIT]:
            BitfinexOrderTypeEnum.EXCHANGE_STOP_LIMIT,
        [AlunaOrderTypesEnum.FILL_OF_KILL]:
            BitfinexOrderTypeEnum.EXCHANGE_FOK,
        [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]:
            BitfinexOrderTypeEnum.EXCHANGE_IOC,
      },
    })({ from })

  }

  return buildAdapter<AlunaOrderTypesEnum, BitfinexOrderTypeEnum>({
    errorMessagePrefix,
    mappings: {
      [AlunaOrderTypesEnum.LIMIT]: BitfinexOrderTypeEnum.LIMIT,
      [AlunaOrderTypesEnum.MARKET]: BitfinexOrderTypeEnum.MARKET,
      [AlunaOrderTypesEnum.STOP_MARKET]: BitfinexOrderTypeEnum.STOP,
      [AlunaOrderTypesEnum.STOP_LIMIT]:
          BitfinexOrderTypeEnum.STOP_LIMIT,
      [AlunaOrderTypesEnum.FILL_OF_KILL]:
          BitfinexOrderTypeEnum.FOK,
      [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]:
          BitfinexOrderTypeEnum.IOC,
    },
  })({ from })

}

