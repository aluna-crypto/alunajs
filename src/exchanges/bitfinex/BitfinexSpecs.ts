import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaExchangeOrderSpecsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'



const exchangeOrderTypes: IAlunaExchangeOrderSpecsSchema[] = [
  {
    type: AlunaOrderTypesEnum.LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.MARKET,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.STOP_MARKET,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
  {
    type: AlunaOrderTypesEnum.STOP_LIMIT,
    supported: true,
    implemented: true,
    mode: AlunaFeaturesModeEnum.WRITE,
    options: {
      rate: 1,
      amount: 1,
      limitRate: 1,
    },
  },
]

export const BitfinexSpecs: IAlunaExchangeSchema = {
  id: 'bitfinex',
  name: 'Bitfinex',
  signupUrl: 'https://www.bitfinex.com/sign-up/',
  connectApiUrl: 'https://setting.bitfinex.com/api#new-key',

  /**
   * https://docs.bitfinex.com/docs/requirements-and-limitations
   *
   * Bitfinex API access is rate limited. For the REST API, an IP address can
   * be rate limited if it has sent too many requests per minute. The current
   * rate limit is between 10 and 90 requests per minute, depending on the
   * specific REST API endpoint (i.e. /ticker). If an IP address is rate
   * limited, the IP is blocked for 60 seconds and cannot make any requests
   * during that time. If your IP address is rate limited, the API will return
   * the JSON response {“error”: “ERR_RATE_LIMIT”}”.
   */
  rateLimitingPerMinute: {
    // double check rate limits later
    perApiKey: -1,
    perIp: 70,
  },
  modes: {
    balance: AlunaFeaturesModeEnum.READ,
    order: AlunaFeaturesModeEnum.WRITE,
  },
  accounts: [
    {
      type: AlunaAccountEnum.EXCHANGE,
      supported: true,
      implemented: true,
      orderTypes: exchangeOrderTypes,
    },
    {
      type: AlunaAccountEnum.MARGIN,
      supported: true,
      implemented: true,
      orderTypes: exchangeOrderTypes,
    },
    {
      type: AlunaAccountEnum.DERIVATIVES,
      supported: true,
      implemented: false,
      orderTypes: [],
    },
    {
      type: AlunaAccountEnum.LENDING,
      supported: true,
      implemented: false,
      orderTypes: [],
    },
  ],
}
