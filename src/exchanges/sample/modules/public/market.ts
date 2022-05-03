import { IAlunaExchangePublic } from '../../../../lib/core/IAlunaExchange'
import { IAlunaMarketModule } from '../../../../lib/modules/public/IAlunaMarketModule'
import { list } from './market/list'
import { listRaw } from './market/listRaw'
import { parse } from './market/parse'
import { parseMany } from './market/parseMany'



export function market(exchange: IAlunaExchangePublic): IAlunaMarketModule {

  return {
    list: list(exchange),
    listRaw: listRaw(exchange),

    parse: parse(exchange),
    parseMany: parseMany(exchange),
  }

}
