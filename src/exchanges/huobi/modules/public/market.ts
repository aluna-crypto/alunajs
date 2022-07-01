import { IAlunaExchangePublic } from '../../../../lib/core/IAlunaExchange'
import { IAlunaMarketModule } from '../../../../lib/modules/public/IAlunaMarketModule'
import { get } from './market/get'
import { getRaw } from './market/getRaw'
import { list } from './market/list'
import { listRaw } from './market/listRaw'
import { parse } from './market/parse'
import { parseMany } from './market/parseMany'



export function market(exchange: IAlunaExchangePublic): IAlunaMarketModule {

  return {
    get: get(exchange),
    getRaw: getRaw(exchange),

    list: list(exchange),
    listRaw: listRaw(exchange),

    parse: parse(exchange),
    parseMany: parseMany(exchange),
  }

}
