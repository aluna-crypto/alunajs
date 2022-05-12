import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { GateAuthed } from '../../../GateAuthed'
import { GATE_RAW_MARKETS } from '../../../test/fixtures/gateMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: GateAuthed,
    exchangeId: 'gate',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: GATE_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
