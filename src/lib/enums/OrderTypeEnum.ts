export enum OrderTypesEnum {
  LIMIT = 'limit',
  MARKET = 'market',
  STOP_MARKET = 'stop-market',
  STOP_LIMIT = 'stop-limit',

  TRAILING_STOP = 'trailing-stop',

  FILL_OF_KILL = 'fill-or-kill',
  IMMEDIATE_OR_CANCEL = 'immediate-or-cancel',
  LIMIT_ORDER_BOOK = 'limit-order-book',

  TAKE_PROFIT_LIMIT = 'take-profit-limit',
  TAKE_PROFIT_MARKET = 'take-profit-market',
}
