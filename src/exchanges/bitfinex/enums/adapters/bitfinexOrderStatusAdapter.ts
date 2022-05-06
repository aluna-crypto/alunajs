import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { BitfinexOrderStatusEnum } from '../BitfinexOrderStatusEnum'



const errorMessagePrefix = 'Order status'

export const translateOrderStatusToAluna = (params: {
  from: string
}): AlunaOrderStatusEnum => {

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

      const message = `${errorMessagePrefix} not supported: ${from}`

      throw new AlunaError({
        message,
        code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
      })

    }

  }

}



export const translateOrderStatusToBitfinex = buildAdapter<
  AlunaOrderStatusEnum,
  BitfinexOrderStatusEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderStatusEnum.OPEN]: BitfinexOrderStatusEnum.ACTIVE,
    [AlunaOrderStatusEnum.FILLED]: BitfinexOrderStatusEnum.EXECUTED,
    [AlunaOrderStatusEnum.PARTIALLY_FILLED]:
      BitfinexOrderStatusEnum.PARTIALLY_FILLED,
    [AlunaOrderStatusEnum.CANCELED]: BitfinexOrderStatusEnum.CANCELED,
  },
})

