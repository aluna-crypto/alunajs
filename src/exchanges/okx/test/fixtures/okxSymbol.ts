import { IAlunaSymbolSchema } from '../../../../lib/schemas/IAlunaSymbolSchema'
import { OkxSymbolStatusEnum } from '../../enums/OkxSymbolStatusEnum'
import { IOkxSymbolSchema } from '../../schemas/IOkxSymbolSchema'



export const OKX_RAW_SPOT_SYMBOLS: IOkxSymbolSchema[] = [
  {
    alias: '',
    baseCcy: 'BTC',
    category: '1',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'BTC-USDT',
    instType: 'SPOT',
    lever: '10',
    listTime: '1548133413000',
    lotSz: '0.00000001',
    minSz: '0.00001',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.1',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'ETH',
    category: '1',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'ETH-USDT',
    instType: 'SPOT',
    lever: '10',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '0.001',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.01',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'DOGE',
    category: '2',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'DOGE-USDT',
    instType: 'SPOT',
    lever: '5',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '10',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.000001',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'USDT',
    category: '2',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'USDT-BNB',
    instType: 'SPOT',
    lever: '5',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '10',
    optType: '',
    quoteCcy: 'BNB',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.000001',
    uly: '',
  },
]

export const OKX_RAW_MARGIN_SYMBOLS: IOkxSymbolSchema[] = [
  {
    alias: '',
    baseCcy: 'BTC',
    category: '1',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'BTC-USDT',
    instType: 'SPOT',
    lever: '10',
    listTime: '1548133413000',
    lotSz: '0.00000001',
    minSz: '0.00001',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.1',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'ETH',
    category: '1',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'ETH-USDT',
    instType: 'SPOT',
    lever: '10',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '0.001',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.01',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'USDT',
    category: '2',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'USDT-BNB',
    instType: 'SPOT',
    lever: '5',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '10',
    optType: '',
    quoteCcy: 'BNB',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.000001',
    uly: '',
  },
  {
    alias: '',
    baseCcy: 'LTC',
    category: '2',
    ctMult: '',
    ctType: '',
    ctVal: '',
    ctValCcy: '',
    expTime: '',
    instId: 'LTC-USDT',
    instType: 'SPOT',
    lever: '5',
    listTime: '1548133413000',
    lotSz: '0.000001',
    minSz: '10',
    optType: '',
    quoteCcy: 'USDT',
    settleCcy: '',
    state: OkxSymbolStatusEnum.LIVE,
    stk: '',
    tickSz: '0.000001',
    uly: '',
  },
]

export const OKX_RAW_SUSPENDED_SYMBOL: IOkxSymbolSchema = {
  alias: '',
  baseCcy: 'ADA',
  category: '1',
  ctMult: '',
  ctType: '',
  ctVal: '',
  ctValCcy: '',
  expTime: '',
  instId: 'ADA-USDT',
  instType: 'SPOT',
  lever: '10',
  listTime: '1548133413000',
  lotSz: '0.00000001',
  minSz: '0.00001',
  optType: '',
  quoteCcy: 'USDT',
  settleCcy: '',
  state: OkxSymbolStatusEnum.SUSPEND,
  stk: '',
  tickSz: '0.1',
  uly: '',
}

export const OKX_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'BTC',
    exchangeId: 'okx',
    alias: undefined,
    meta: {},
  },
  {
    id: 'USDT',
    exchangeId: 'okx',
    alias: undefined,
    meta: {},
  },
  {
    id: 'ETH',
    exchangeId: 'okx',
    alias: undefined,
    meta: {},
  },
  {
    id: 'DOGE',
    exchangeId: 'okx',
    alias: undefined,
    meta: {},
  },
  {
    id: 'BNB',
    exchangeId: 'okx',
    alias: undefined,
    meta: {},
  },
]
