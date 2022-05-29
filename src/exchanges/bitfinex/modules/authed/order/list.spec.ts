import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_ORDERS } from '../../../test/fixtures/bitfinexOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitfinexAuthed,
    exchangeId: 'bitfinex',
    methodModuleName: 'order',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: BITFINEX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
