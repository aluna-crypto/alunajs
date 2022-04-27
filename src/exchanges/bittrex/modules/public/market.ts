import { IAlunaMarketModule } from '../../../../lib/modules/public/IAlunaMarketModule'
import { list } from './market/list'
import { listRaw } from './market/listRaw'
import { parse } from './market/parse'
import { parseMany } from './market/parseMany'



export const market: IAlunaMarketModule = {

  list,
  listRaw,

  parse,
  parseMany,

}
