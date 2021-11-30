export const BINANCE_RAW_BALANCES = [
  { asset: "BTC", free: "0.04400000", locked: "0.02200000" },
  { asset: "LTC", free: "0.10000000", locked: "0.20000000" },
  { asset: "ETH", free: "0.02200000", locked: "0.00000000" },
  { asset: "USDT", free: "0.00000000", locked: "0.00000000" },
]

export const BINANCE_PARSED_BALANCES = [
  {
    symbolId: "BTC",
    account: "exchange",
    available: 0.044,
    total: 0.066,
    meta: { asset: "BTC", free: "0.04400000", locked: "0.02200000" },
  },
  {
    symbolId: "LTC",
    account: "exchange",
    available: 0.10,
    total: 0.20,
    meta: { asset: "LTC", free: "0.10000000", locked: "0.20000000" },
  },
  {
    symbolId: "ETH",
    account: "exchange",
    available: 0.022,
    total: 0.022,
    meta: { asset: "ETH", free: "0.02200000", locked: "0.00000000" },
  },
  {
    symbolId: "USDT",
    account: "exchange",
    available: 0,
    total: 0,
    meta: { asset: "ETH", free: "0.000000", locked: "0.00000000" },
  },
]
