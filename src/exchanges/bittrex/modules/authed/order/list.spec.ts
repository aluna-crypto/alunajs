import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BITTREX_RAW_ORDERS } from '../../../test/fixtures/bittrexOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BittrexAuthed,
    exchangeId: 'bittrex',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: BITTREX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
