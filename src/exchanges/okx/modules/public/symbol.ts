import { IAlunaExchangePublic } from '../../../../lib/core/IAlunaExchange'
import { IAlunaSymbolModule } from '../../../../lib/modules/public/IAlunaSymbolModule'
import { list } from './symbol/list'
import { listRaw } from './symbol/listRaw'
import { parse } from './symbol/parse'
import { parseMany } from './symbol/parseMany'



export function symbol(exchange: IAlunaExchangePublic): IAlunaSymbolModule {

  return {
    list: list(exchange),
    listRaw: listRaw(exchange),

    parse: parse(exchange),
    parseMany: parseMany(exchange),
  }

}
