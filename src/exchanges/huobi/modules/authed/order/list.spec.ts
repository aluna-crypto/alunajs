import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_ORDERS } from '../../../test/fixtures/huobiOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: HuobiAuthed,
    exchangeId: 'huobi',
    methodModuleName: 'order',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: HUOBI_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
