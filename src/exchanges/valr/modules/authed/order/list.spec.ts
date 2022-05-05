import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_ORDERS } from '../../../test/fixtures/valrOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: VALR_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
