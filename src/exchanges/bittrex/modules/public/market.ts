import { IAlunaMarketModule } from '../../../../lib/modules/IAlunaMarketModule'
import { get } from './market/get'
import { getRaw } from './market/getRaw'
import { list } from './market/list'
import { listRaw } from './market/listRaw'
import { parse } from './market/parse'
import { parseMany } from './market/parseMany'



export const market: IAlunaMarketModule = {

  get,
  getRaw,

  list,
  listRaw,

  parse,
  parseMany,

}
