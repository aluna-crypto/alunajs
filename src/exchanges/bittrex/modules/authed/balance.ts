import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaBalanceModule } from '../../../../lib/modules/authed/IAlunaBalanceModule'
import { getTradableBalance } from './balance/getTradableBalance'
import { list } from './balance/list'
import { listRaw } from './balance/listRaw'
import { parse } from './balance/parse'
import { parseMany } from './balance/parseMany'



export function balance (exchange: IAlunaExchangeAuthed): IAlunaBalanceModule {

  return {
    listRaw: listRaw(exchange),
    list: list(exchange),
    parseMany: parseMany(exchange),
    parse: parse(exchange),
    getTradableBalance: getTradableBalance(exchange),
  }

}
