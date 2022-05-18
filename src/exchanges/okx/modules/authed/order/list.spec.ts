import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_ORDERS } from '../../../test/fixtures/okxOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: OkxAuthed,
    exchangeId: 'okx',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: OKX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
