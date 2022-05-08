import { SampleOrderTypeEnum } from '../../enums/SampleOrderTypeEnum'
import { ISampleOrderSchema } from '../../schemas/ISampleOrderSchema'



// TODO: Review fixtures
export const SAMPLE_RAW_ORDERS: ISampleOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    symbol: 'BTC/USD',
    type: SampleOrderTypeEnum.LIMIT,
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    symbol: 'ETH/USD',
    type: SampleOrderTypeEnum.MARKET,
  },
]
