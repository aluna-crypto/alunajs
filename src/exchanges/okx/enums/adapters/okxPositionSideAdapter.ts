import { buildAdapter } from '../../../../lib/enums/adapters/buildAdapter'
import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { OkxPositionSideEnum } from '../OkxPositionSideEnum'



const errorMessagePrefix = 'Position side'



export const translatePositionSideToAluna = buildAdapter<
  OkxPositionSideEnum,
  AlunaPositionSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [OkxPositionSideEnum.LONG]: AlunaPositionSideEnum.LONG,
    [OkxPositionSideEnum.SHORT]: AlunaPositionSideEnum.SHORT,
  },
})



export const translatePositionSideToOkx = buildAdapter<
  AlunaPositionSideEnum,
  OkxPositionSideEnum
>({
  errorMessagePrefix,
  mappings: {
    [AlunaPositionSideEnum.LONG]: OkxPositionSideEnum.LONG,
    [AlunaPositionSideEnum.SHORT]: OkxPositionSideEnum.SHORT,
  },
})
