import { HuobiAccountTypeEnum } from '../../enums/HuobiAccountTypeEnum'
import { IHuobiUserAccountSchema } from '../../schemas/IHuobiHelperSchema'



export const HUOBI_RAW_ACCOUNTS: IHuobiUserAccountSchema[] = [
  {
    id: 123456,
    type: HuobiAccountTypeEnum.POINT,
    subtype: '',
    state: 'working',
  },
  {
    id: 1234567,
    type: HuobiAccountTypeEnum.SPOT,
    subtype: '',
    state: 'working',
  },
]
