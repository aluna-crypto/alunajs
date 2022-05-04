import { SampleOrderTypeEnum } from '../../enums/SampleOrderTypeEnum'
import { ISampleOrderSchema } from '../../schemas/ISampleOrderSchema'



// TODO: Review fixtures
export const SAMPLE_RAW_ORDERS: ISampleOrderSchema[] = [
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb7',
    type: SampleOrderTypeEnum.LIMIT,
    quantity: '9.94497801',
  },
  {
    id: '8bc1e59c-77fa-4554-bd11-966e360e4eb8',
    type: SampleOrderTypeEnum.MARKET,
    quantity: '9.94497801',
  },
]

