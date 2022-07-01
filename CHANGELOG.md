# 1.3.0 (July 1, 2022)

 - Added Huobi exchange, supporting spot trading

# 1.2.3 (June 14, 2022)

 - Add new `AlunaOrderErrorCodes`
 - Handling new case for for invalid order amount on Bitmex
 - Adjusting corner-case for canceled orders on Bitfinex

# 1.2.2 (June 10, 2022)

 - Add new `AlunaOrderErrorCodes`
 - Handle invalid order amount error on Bitfinex/Bitmex
 - Handle invalid order price error on Bitmex
 - Ajustments in `IAlunaMarketSchema`
   - Add `minTradeAmount`
   - Add `maxTradeAmount`

# 1.2.1 (June 8, 2022)

 - Use HTTP status code 200 for known errors

# 1.2.0 (June 7, 2022)

 - Add support for derivatives trading on Ftx
 - Improved e2e tests for `key` module
 - Fix invalid-key error for Gate
 - Ajustments in `IAlunaOrderGetParams` interface
   - Add prop `type`

# 1.1.1 (June 1, 2022)

 - Add new value `default` for `AlunaWalletEnum`
 - Ajustments in `IAlunaExchangeAccountSpecsSchema` interface
   - Add prop `wallet`
 - Ajustments in `IAlunaExchangeOrderOptionsSchema` interface
   - Removed obsolete specs: `mode` and `options`
   - Changed prop `supported` type

# 1.1.0 (May 24, 2022)

 - Improved order and position integration tests
 - Added FTX exchange, supporting spot trading
 - Fixed parse for Poloniex orders
 - Fixed parse for Bitfinex market orders
 - Fixed parse for Bitmex/Bitfinex closed positions

# 1.0.3 (May 20, 2022)

 - Fix Bitfinex position `openPrice` parse

# 1.0.2 (May 19, 2022)

 - Filtering zeroed balances
 - Fixing insufficient-balance error for Valr/Poloniex

# 1.0.1 (May 18, 2022)

 - Adjustments in `IAlunaExchangeSchema` interface
   - Removes obsolete [*and broken*] modes property
   - Making property features required (*as it should*)

# 1.0.0 (May 17, 2022)

 - Initial public release, includes:
   - Binance
   - Bitfinex
   - Bitmex
   - Bittrex
   - Gate
   - Poloniex
   - Valr
