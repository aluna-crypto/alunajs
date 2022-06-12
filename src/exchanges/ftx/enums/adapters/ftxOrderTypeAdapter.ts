import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'
import { FtxTriggerOrderTypeEnum } from '../FtxTriggerOrderTypeEnum'



const errorMessagePrefix = 'Order type'



const triggerOrderTranslator = {
  [FtxOrderTypeEnum.LIMIT]: {
    [FtxTriggerOrderTypeEnum.STOP]: AlunaOrderTypesEnum.STOP_LIMIT,
    [FtxTriggerOrderTypeEnum.TAKE_PROFIT]: AlunaOrderTypesEnum.TAKE_PROFIT_LIMIT,
    [FtxTriggerOrderTypeEnum.TRAILING_STOP]: AlunaOrderTypesEnum.TRAILING_STOP,
  },
  [FtxOrderTypeEnum.MARKET]: {
    [FtxTriggerOrderTypeEnum.STOP]: AlunaOrderTypesEnum.STOP_MARKET,
    [FtxTriggerOrderTypeEnum.TAKE_PROFIT]: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
    [FtxTriggerOrderTypeEnum.TRAILING_STOP]: AlunaOrderTypesEnum.TRAILING_STOP,
  },
}



const orderTranslator = {
  [FtxOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
  [FtxOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
}



export const translateOrderTypeToAluna = (
  params: {
    type: FtxOrderTypeEnum | FtxTriggerOrderTypeEnum
    orderType?: FtxOrderTypeEnum
  },
) => {

  const {
    type,
    orderType,
  } = params

  let alunaOrderType: AlunaOrderTypesEnum

  if (orderType) {

    alunaOrderType = triggerOrderTranslator[orderType][type]

  } else {

    alunaOrderType = orderTranslator[type]

  }

  return alunaOrderType

}



export const translateOrderTypeToFtx = buildAdapter<
  AlunaOrderTypesEnum,
  FtxOrderTypeEnum | FtxTriggerOrderTypeEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaOrderTypesEnum.LIMIT]: FtxOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: FtxOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.STOP_LIMIT]: FtxTriggerOrderTypeEnum.STOP,
    [AlunaOrderTypesEnum.STOP_MARKET]: FtxTriggerOrderTypeEnum.STOP,
  },
})
