import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitmexOrderTypeEnum } from '../BitmexOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<BitmexOrderTypeEnum, AlunaOrderTypesEnum>({
  errorMessagePrefix,
  mappings: {
    [BitmexOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [BitmexOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [BitmexOrderTypeEnum.STOP_MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
    [BitmexOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
  },
})


export const translateOrderTypeToBitmex = buildAdapter<AlunaOrderTypesEnum, BitmexOrderTypeEnum>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: BitmexOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: BitmexOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.STOP_MARKET]: BitmexOrderTypeEnum.STOP_MARKET,
    [AlunaOrderTypesEnum.STOP_LIMIT]: BitmexOrderTypeEnum.STOP_LIMIT,
  },
})
