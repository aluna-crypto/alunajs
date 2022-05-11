import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { GateAuthed } from '../../../GateAuthed'
import { GATE_RAW_ORDERS } from '../../../test/fixtures/gateOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: GateAuthed,
    exchangeId: 'gate',
    methodModuleName: 'order',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: GATE_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
