import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { IAlunaExchangeSpecsSchema } from '../../lib/schemas/IAlunaExchangeSpecsSchema'



export const BinanceSpecs: IAlunaExchangeSpecsSchema = {
  id: 'binance',
  acceptFloatAmounts: true,
  features: {
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.WRITE,
  },
  accounts: [
    {
      type: AlunaAccountEnum.EXCHANGE,
      supported: true,
      implemented: true,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: true,
      implemented: false,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: false,
    },
  ],
}
