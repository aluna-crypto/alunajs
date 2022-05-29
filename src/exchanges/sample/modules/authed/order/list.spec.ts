import { PARSED_ORDERS } from '../../../../../../test/fixtures/parsedOrders'
import { testList } from '../../../../../../test/macros/testList'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_ORDERS } from '../../../test/fixtures/sampleOrders'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: SampleAuthed,
    exchangeId: 'sample',
    methodModuleName: 'order',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawOrders: SAMPLE_RAW_ORDERS },
    parsedList: { orders: PARSED_ORDERS },
  })

})
