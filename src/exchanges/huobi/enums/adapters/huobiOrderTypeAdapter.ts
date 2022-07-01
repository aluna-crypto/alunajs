import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderSideEnum } from '../../../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'



const errorMessagePrefix = 'Order type'


export interface ITranslateHuobiOrderTypeParams {
  type: AlunaOrderTypesEnum
  side: AlunaOrderSideEnum
}


export const translateOrderTypeToAluna = buildAdapter<
  HuobiOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiOrderTypeEnum.BUY_MARKET]: AlunaOrderTypesEnum.MARKET,
    [HuobiOrderTypeEnum.SELL_MARKET]: AlunaOrderTypesEnum.MARKET,
    [HuobiOrderTypeEnum.BUY_LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.SELL_LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.BUY_IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [HuobiOrderTypeEnum.SELL_IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [HuobiOrderTypeEnum.BUY_LIMIT_MAKER]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.SELL_LIMIT_MAKER]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.BUY_STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.SELL_STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.BUY_LIMIT_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
    [HuobiOrderTypeEnum.SELL_LIMIT_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
    [HuobiOrderTypeEnum.BUY_STOP_LIMIT_FOK]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.SELL_STOP_LIMIT_FOK]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.STOP_MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
  },
})


export const translateOrderTypeToHuobi = ({
  type,
  side,
}: ITranslateHuobiOrderTypeParams): string => {

  const mappings = {
    [AlunaOrderTypesEnum.LIMIT]: `${side}-limit`,
    [AlunaOrderTypesEnum.MARKET]: `${side}-market`,
    [AlunaOrderTypesEnum.STOP_LIMIT]: HuobiOrderTypeEnum.STOP_LIMIT,
    [AlunaOrderTypesEnum.STOP_MARKET]: HuobiOrderTypeEnum.STOP_MARKET,
  }

  const translated: HuobiOrderTypeEnum = mappings[type]

  if (!translated) {

    throw new AlunaError({
      message: `${errorMessagePrefix} not supported: ${type}`,
      code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
    })

  }

  return translated

}
