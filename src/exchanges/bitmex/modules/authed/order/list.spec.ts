import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_ORDERS } from '../../../test/fixtures/bitmexOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitmexAuthed,
    exchangeId: 'bitmex',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: BITMEX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
