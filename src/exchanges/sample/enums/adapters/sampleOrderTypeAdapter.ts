import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { SampleOrderTypeEnum } from '../SampleOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  SampleOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [SampleOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [SampleOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [SampleOrderTypeEnum.CEILING_LIMIT]:
          AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
    [SampleOrderTypeEnum.CEILING_MARKET]:
          AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
  },
})



export const translateOrderTypeToSample = buildAdapter<
  AlunaOrderTypesEnum,
  SampleOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: SampleOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: SampleOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.LIMIT_ORDER_BOOK]:
          SampleOrderTypeEnum.CEILING_LIMIT,
    [AlunaOrderTypesEnum.TAKE_PROFIT_MARKET]:
          SampleOrderTypeEnum.CEILING_MARKET,
  },
})

