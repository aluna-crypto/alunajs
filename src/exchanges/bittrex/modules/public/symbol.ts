import { IAlunaSymbolModule } from '../../../../lib/modules/IAlunaSymbolModule'
import { get } from './symbol/get'
import { getRaw } from './symbol/getRaw'
import { list } from './symbol/list'
import { listRaw } from './symbol/listRaw'
import { parse } from './symbol/parse'
import { parseMany } from './symbol/parseMany'



export const symbol: IAlunaSymbolModule = {

  get,
  getRaw,

  list,
  listRaw,

  parse,
  parseMany,

}
