import { IAlunaSymbolSchema } from '../../../../index'
import { IBinanceSymbolResponseSchema } from '../../schemas/IBinanceSymbolSchema'



export const BINANCE_RAW_SYMBOLS: IBinanceSymbolResponseSchema = {
  timezone: 'UTC',
  serverTime: 1637841089806,
  rateLimits: [
    {
      rateLimitType: 'REQUEST_WEIGHT',
      interval: 'MINUTE',
      intervalNum: 1,
      limit: 1200,
    },
    {
      rateLimitType: 'ORDERS',
      interval: 'SECOND',
      intervalNum: 10,
      limit: 50,
    },
    {
      rateLimitType: 'ORDERS',
      interval: 'DAY',
      intervalNum: 1,
      limit: 160000,
    },
    {
      rateLimitType: 'RAW_REQUESTS',
      interval: 'MINUTE',
      intervalNum: 5,
      limit: 6100,
    },
  ],
  exchangeFilters: [],
  symbols: [
    {
      symbol: 'ETHBTC',
      status: 'TRADING',
      baseAsset: 'ETH',
      baseAssetPrecision: 8,
      quoteAsset: 'BTC',
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: [
        'LIMIT',
        'LIMIT_MAKER',
        'MARKET',
        'STOP_LOSS_LIMIT',
        'TAKE_PROFIT_LIMIT',
      ],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [
        {
          filterType: 'PRICE_FILTER',
          minPrice: '0.00000100',
          maxPrice: '922327.00000000',
          tickSize: '0.00000100',
        },
        {
          filterType: 'PERCENT_PRICE',
          multiplierUp: '5',
          multiplierDown: '0.2',
          avgPriceMins: 5,
        },
        {
          filterType: 'LOT_SIZE',
          minQty: '0.00010000',
          maxQty: '100000.00000000',
          stepSize: '0.00010000',
        },
        {
          filterType: 'MIN_NOTIONAL',
          minNotional: '0.00010000',
          applyToMarket: true,
          avgPriceMins: 5,
        },
        {
          filterType: 'ICEBERG_PARTS',
          limit: 10,
        },
        {
          filterType: 'MARKET_LOT_SIZE',
          minQty: '0.00000000',
          maxQty: '1010.54961473',
          stepSize: '0.00000000',
        },
        {
          filterType: 'MAX_NUM_ORDERS',
          maxNumOrders: 200,
        },
        {
          filterType: 'MAX_NUM_ALGO_ORDERS',
          maxNumAlgoOrders: 5,
        },
      ],
      permissions: ['SPOT', 'MARGIN'],
    },
    {
      symbol: 'LTCBTC',
      status: 'TRADING',
      baseAsset: 'LTC',
      baseAssetPrecision: 8,
      quoteAsset: 'BTC',
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: [
        'LIMIT',
        'LIMIT_MAKER',
        'MARKET',
        'STOP_LOSS_LIMIT',
        'TAKE_PROFIT_LIMIT',
      ],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [
        {
          filterType: 'PRICE_FILTER',
          minPrice: '0.00000100',
          maxPrice: '100000.00000000',
          tickSize: '0.00000100',
        },
        {
          filterType: 'PERCENT_PRICE',
          multiplierUp: '5',
          multiplierDown: '0.2',
          avgPriceMins: 5,
        },
        {
          filterType: 'LOT_SIZE',
          minQty: '0.00100000',
          maxQty: '100000.00000000',
          stepSize: '0.00100000',
        },
        {
          filterType: 'MIN_NOTIONAL',
          minNotional: '0.00010000',
          applyToMarket: true,
          avgPriceMins: 5,
        },
        {
          filterType: 'ICEBERG_PARTS',
          limit: 10,
        },
        {
          filterType: 'MARKET_LOT_SIZE',
          minQty: '0.00000000',
          maxQty: '7359.49099722',
          stepSize: '0.00000000',
        },
        {
          filterType: 'MAX_NUM_ORDERS',
          maxNumOrders: 200,
        },
        {
          filterType: 'MAX_NUM_ALGO_ORDERS',
          maxNumAlgoOrders: 5,
        },
      ],
      permissions: ['SPOT', 'MARGIN'],
    },
    {
      symbol: 'BNBBTC',
      status: 'TRADING',
      baseAsset: 'BNB',
      baseAssetPrecision: 8,
      quoteAsset: 'BTC',
      quotePrecision: 8,
      quoteAssetPrecision: 8,
      baseCommissionPrecision: 8,
      quoteCommissionPrecision: 8,
      orderTypes: [
        'LIMIT',
        'LIMIT_MAKER',
        'MARKET',
        'STOP_LOSS_LIMIT',
        'TAKE_PROFIT_LIMIT',
      ],
      icebergAllowed: true,
      ocoAllowed: true,
      quoteOrderQtyMarketAllowed: true,
      isSpotTradingAllowed: true,
      isMarginTradingAllowed: true,
      filters: [
        {
          filterType: 'PRICE_FILTER',
          minPrice: '0.00000100',
          maxPrice: '100000.00000000',
          tickSize: '0.00000100',
        },
        {
          filterType: 'PERCENT_PRICE',
          multiplierUp: '5',
          multiplierDown: '0.2',
          avgPriceMins: 5,
        },
        {
          filterType: 'LOT_SIZE',
          minQty: '0.00100000',
          maxQty: '100000.00000000',
          stepSize: '0.00100000',
        },
        {
          filterType: 'MIN_NOTIONAL',
          minNotional: '0.00010000',
          applyToMarket: true,
          avgPriceMins: 5,
        },
        {
          filterType: 'ICEBERG_PARTS',
          limit: 10,
        },
        {
          filterType: 'MARKET_LOT_SIZE',
          minQty: '0.00000000',
          maxQty: '13755.68382070',
          stepSize: '0.00000000',
        },
        {
          filterType: 'MAX_NUM_ORDERS',
          maxNumOrders: 200,
        },
        {
          filterType: 'MAX_NUM_ALGO_ORDERS',
          maxNumAlgoOrders: 5,
        },
      ],
      permissions: ['SPOT', 'MARGIN'],
    },
  ],
}

export const BINANCE_PARSED_SYMBOLS: IAlunaSymbolSchema[] = [
  {
    id: 'ETH',
    exchangeId: 'binance',
    meta: {},
  },
  {
    id: 'LTC',
    exchangeId: 'binance',
    meta: {},
  },
  {
    id: 'BNB',
    exchangeId: 'binance',
    meta: {},
  },
]
