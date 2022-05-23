import { HuobiOrderTypeEnum } from '../../enums/HuobiOrderTypeEnum'
import { IHuobiOrderSchema } from '../../schemas/IHuobiOrderSchema'



// TODO: Review fixtures
export const HUOBI_RAW_ORDERS: IHuobiOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: HuobiOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: HuobiOrderTypeEnum.MARKET,
  },
]
