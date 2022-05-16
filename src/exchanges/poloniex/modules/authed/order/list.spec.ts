import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_ORDERS } from '../../../test/fixtures/poloniexOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: PoloniexAuthed,
    exchangeId: 'poloniex',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: POLONIEX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
