import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaPositionModule } from '../../../../lib/modules/authed/IAlunaPositionModule'
import { list } from './position/list'
import { listRaw } from './position/listRaw'
import { parse } from './position/parse'
import { parseMany } from './position/parseMany'



export function position(exchange: IAlunaExchangeAuthed): IAlunaPositionModule {

  return {

    listRaw: listRaw(exchange),
    list: list(exchange),
    parse: parse(exchange),
    parseMany: parseMany(exchange),

  } as any

}
