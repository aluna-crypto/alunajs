import {
  IBitfinexMarketsSchema,
  IBitfinexTicker,
} from '../../schemas/IBitfinexMarketSchema'



export const BITFINEX_RAW_TICKERS: IBitfinexTicker[] = [
  [
    'tBTCUSD',
    36682,
    20.4328296,
    36689,
    13.02177299,
    2260,
    0.0656,
    36687,
    14675.38709555,
    37596,
    33828,
  ],
  [
    'tUDC:BTC',
    0.0017555,
    5821.594260479999,
    0.0017588,
    8178.96547349,
    -0.0001771,
    -0.0916,
    0.0017559,
    476196.82839484,
    0.001933,
    0.001735,
  ],
  [
    'tETHBTC',
    0.066311,
    92.98021137,
    0.066343,
    44.94425328,
    -0.000179,
    -0.0027,
    0.066335,
    6272.44117045,
    0.066943,
    0.064728,
  ],
  [
    'tBTCF0:USTF0', // derivative ticker, should be skipped for now
    37945,
    11.257977640000002,
    37949,
    14.656851710000003,
    1467,
    0.0402,
    37944,
    2253.11236956,
    38291,
    36003,
  ],
]



export const BITFINEX_MARGIN_ENABLED_CURRENCIES: string[][] = [
  [
    'tBTCUSD',
    'tUDC:BTC',
  ],
]



export const BITFINEX_RAW_MARKETS: IBitfinexMarketsSchema = {
  enabledMarginCurrencies: BITFINEX_MARGIN_ENABLED_CURRENCIES,
  tickers: BITFINEX_RAW_TICKERS,
}

