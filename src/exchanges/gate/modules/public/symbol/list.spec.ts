import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { GateAuthed } from '../../../GateAuthed'
import { GATE_RAW_SYMBOLS } from '../../../test/fixtures/gateSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: GateAuthed,
    exchangeId: 'gate',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: GATE_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
