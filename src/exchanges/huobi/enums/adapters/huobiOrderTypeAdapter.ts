import { AlunaError } from '../../../../lib/core/AlunaError'
import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAdaptersErrorCodes } from '../../../../lib/errors/AlunaAdaptersErrorCodes'
import { HuobiOrderSideEnum } from '../HuobiOrderSideEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'



const errorMessagePrefix = 'Order type'


export interface ITranslateHuobiOrderTypeParams {
  from: AlunaOrderTypesEnum
  side: HuobiOrderSideEnum
}


export const translateOrderTypeToAluna = buildAdapter<
  HuobiOrderTypeEnum,
  AlunaOrderTypesEnum
>({
  errorMessagePrefix,
  mappings: {
    [HuobiOrderTypeEnum.LIMIT]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.STOP_LIMIT]: AlunaOrderTypesEnum.STOP_LIMIT,
    [HuobiOrderTypeEnum.STOP_MARKET]: AlunaOrderTypesEnum.STOP_MARKET,
    [HuobiOrderTypeEnum.MARKET]: AlunaOrderTypesEnum.MARKET,
    [HuobiOrderTypeEnum.LIMIT_MAKER]: AlunaOrderTypesEnum.LIMIT,
    [HuobiOrderTypeEnum.IOC]: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
    [HuobiOrderTypeEnum.LIMIT_FOK]: AlunaOrderTypesEnum.FILL_OF_KILL,
  },
})


export const translateOrderTypeToHuobi = ({
  from,
  side,
}: ITranslateHuobiOrderTypeParams): string => {

  const mappings = {
    [AlunaOrderTypesEnum.LIMIT]: HuobiOrderTypeEnum.LIMIT,
    [AlunaOrderTypesEnum.MARKET]: HuobiOrderTypeEnum.MARKET,
    [AlunaOrderTypesEnum.STOP_LIMIT]: HuobiOrderTypeEnum.STOP_LIMIT,
    [AlunaOrderTypesEnum.STOP_MARKET]: HuobiOrderTypeEnum.STOP_MARKET,
    [AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL]: HuobiOrderTypeEnum.IOC,
    [AlunaOrderTypesEnum.FILL_OF_KILL]: HuobiOrderTypeEnum.LIMIT_FOK,
  }

  const translated: HuobiOrderTypeEnum = mappings[from]

  if (!translated) {

    throw new AlunaError({
      message: `${errorMessagePrefix} not supported: ${from}`,
      code: AlunaAdaptersErrorCodes.NOT_SUPPORTED,
    })

  }

  return `${side}-${translated}`

}
