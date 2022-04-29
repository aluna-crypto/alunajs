import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaOrderWriteModule } from '../../../../lib/modules/authed/IAlunaOrderModule'
import { cancel } from './order/cancel'
import { edit } from './order/edit'
import { get } from './order/get'
import { getRaw } from './order/getRaw'
import { list } from './order/list'
import { listRaw } from './order/listRaw'
import { parse } from './order/parse'
import { parseMany } from './order/parseMany'
import { place } from './order/place'



export function order(exchange: IAlunaExchangeAuthed): IAlunaOrderWriteModule {

  return {
    cancel: cancel(exchange),
    edit: edit(exchange),
    get: get(exchange),
    getRaw: getRaw(exchange),
    list: list(exchange),
    listRaw: listRaw(exchange),
    parse: parse(exchange),
    parseMany: parseMany(exchange),
    place: place(exchange),
  }

}
