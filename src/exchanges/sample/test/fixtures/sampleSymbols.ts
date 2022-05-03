import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { ISampleSymbolSchema } from '../../schemas/ISampleSymbolSchema'



export const SAMPLE_RAW_SYMBOLS: ISampleSymbolSchema[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    coinType: 'BITCOIN',
    status: 'ONLINE',
    minConfirmations: 2,
    notice: '',
    txFee: '0.00030000',
    logoUrl: '',
    prohibitedIn: [],
    baseAddress: '1N52wHoVR79PMDishab2XmRHsbekCdGquK',
    associatedTermsOfService: [],
    tags: [],
  },
  {
    symbol: 'LTC',
    name: 'Litecoin',
    coinType: 'BITCOIN16',
    status: 'ONLINE',
    minConfirmations: 6,
    notice: '',
    txFee: '0.01000000',
    logoUrl: '',
    prohibitedIn: [],
    baseAddress: 'LhyLNfBkoKshT7R8Pce6vkB9T2cP2o84hx',
    associatedTermsOfService: [],
    tags: [],
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    coinType: 'ETH',
    status: 'ONLINE',
    minConfirmations: 36,
    notice: '',
    txFee: '0.00460000',
    logoUrl: '',
    prohibitedIn: [],
    baseAddress: '0xfbb1b73c4f0bda4f67dca266ce6ef42f520fbb98',
    associatedTermsOfService: [],
    tags: [],
  },
]

export const SAMPLE_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'BTC',
    name: 'Bitcoin',
    exchangeId: 'sample',
    meta: {},
  },
  {
    id: 'LTC',
    name: 'Litecoin',
    exchangeId: 'sample',
    meta: {},
  },
  {
    id: 'ETH',
    name: 'Ethereum',
    exchangeId: 'sample',
    meta: {},
  },
]
