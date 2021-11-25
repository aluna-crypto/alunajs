import { IBinanceSymbolSchema } from '../../schemas/IBinanceSymbolSchema'



export const BINANCE_RAW_SYMBOLS_INFO: IBinanceSymbolSchema = {
  timezone: "UTC",
  serverTime: 1637841089806,
  rateLimits: [
    {
      rateLimitType: "REQUEST_WEIGHT",
      interval: "MINUTE",
      intervalNum: 1,
      limit: 1200,
    },
    { rateLimitType: "ORDERS", interval: "SECOND", intervalNum: 10, limit: 50 },
    { rateLimitType: "ORDERS", interval: "DAY", intervalNum: 1, limit: 160000 },
    {
      rateLimitType: "RAW_REQUESTS",
      interval: "MINUTE",
      intervalNum: 5,
      limit: 6100,
    },
  ],
  exchangeFilters: [],
  symbols: [
    {
      symbol: "BNBUSDT",
      status: "TRADING",
      baseAsset: "BNB",
      baseAssetPrecision: 8,
      quoteAsset: "USDT",
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: [
        "LIMIT",
        "LIMIT_MAKER",
        "MARKET",
        "STOP_LOSS_LIMIT",
        "TAKE_PROFIT_LIMIT",
      ],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [
        {
          filterType: "PRICE_FILTER",
          minPrice: "0.10000000",
          maxPrice: "100000.00000000",
          tickSize: "0.10000000",
        },
        {
          filterType: "PERCENT_PRICE",
          multiplierUp: "5",
          multiplierDown: "0.2",
          avgPriceMins: 5,
        },
        {
          filterType: "LOT_SIZE",
          minQty: "0.00100000",
          maxQty: "900000.00000000",
          stepSize: "0.00100000",
        },
        {
          filterType: "MIN_NOTIONAL",
          minNotional: "10.00000000",
          applyToMarket: true,
          avgPriceMins: 5,
        },
        { filterType: "ICEBERG_PARTS", limit: 10 },
        {
          filterType: "MARKET_LOT_SIZE",
          minQty: "0.00000000",
          maxQty: "24882.38319305",
          stepSize: "0.00000000",
        },
        { filterType: "MAX_NUM_ORDERS", maxNumOrders: 200 },
        { filterType: "MAX_NUM_ALGO_ORDERS", maxNumAlgoOrders: 5 },
      ],
      permissions: ["SPOT", "MARGIN"],
    },
  ],
};
