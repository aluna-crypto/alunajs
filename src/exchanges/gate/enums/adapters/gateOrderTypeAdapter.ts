import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { GateOrderTypeEnum } from '../GateOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  GateOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [GateOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
  },
})



export const translateOrderTypeToGate = buildAdapter<
  AlunaOrderTypesEnum,
  GateOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: GateOrderTypeEnum.LIMIT,
  },
})
