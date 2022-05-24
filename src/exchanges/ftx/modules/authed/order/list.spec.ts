import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_ORDERS } from '../../../test/fixtures/ftxOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: FTX_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
