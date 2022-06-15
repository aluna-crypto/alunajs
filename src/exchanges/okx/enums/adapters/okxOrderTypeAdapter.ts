import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { OkxOrderTypeEnum } from '../OkxOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = (params: {
  from: OkxOrderTypeEnum
  slOrdPx?: string
}) => {

  const { from, slOrdPx } = params

  const mappings = {
    [OkxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [OkxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
  }

  const translated: AlunaOrderTypesEnum = mappings[from]

  if (translated) {

    return translated

  }

  const isConditionalOrder = from === OkxOrderTypeEnum.CONDITIONAL

  if (isConditionalOrder) {

    return slOrdPx === '-1'
      ? AlunaOrderTypesEnum.STOP_MARKET
      : AlunaOrderTypesEnum.STOP_LIMIT

  }


  const error = new AlunaError({
    message: `${errorMessagePrefix} not supported: ${from}`,
    code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
  })

  throw error

}



export const translateOrderTypeToOkx = buildAdapter<
  AlunaOrderTypesEnum,
  OkxOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: OkxOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: OkxOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.STOP_LIMIT]: OkxOrderTypeEnum.CONDITIONAL,
    [AlunaOrderTypesEnum.STOP_MARKET]: OkxOrderTypeEnum.CONDITIONAL,
  },
})
