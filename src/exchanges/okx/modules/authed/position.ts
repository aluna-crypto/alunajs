import { IAlunaExchangeAuthed } from '../../../../lib/core/IAlunaExchange'
import { IAlunaPositionModule } from '../../../../lib/modules/authed/IAlunaPositionModule'
import { close } from './position/close'
import { get } from './position/get'
import { getLeverage } from './position/getLeverage'
import { getRaw } from './position/getRaw'
import { list } from './position/list'
import { listRaw } from './position/listRaw'
import { parse } from './position/parse'
import { parseMany } from './position/parseMany'
import { setLeverage } from './position/setLeverage'



export function position(exchange: IAlunaExchangeAuthed): IAlunaPositionModule {

  return {
    close: close(exchange),
    get: get(exchange),
    getRaw: getRaw(exchange),
    list: list(exchange),
    listRaw: listRaw(exchange),
    parse: parse(exchange),
    parseMany: parseMany(exchange),
    getLeverage: getLeverage(exchange),
    setLeverage: setLeverage(exchange),
  }

}
