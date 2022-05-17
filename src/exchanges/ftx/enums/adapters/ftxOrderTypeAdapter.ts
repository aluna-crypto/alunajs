import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'



const errorMessagePrefix = 'Order type'



export const translateOrderTypeToAluna = buildAdapter<
  FtxOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [FtxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [FtxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
  },
})



export const translateOrderTypeToFtx = buildAdapter<
  AlunaOrderTypesEnum,
  FtxOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: FtxOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: FtxOrderTypeEnum.MARKET,
  },
})
