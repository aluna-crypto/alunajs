import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { GateAuthed } from '../../../GateAuthed'
import { GATE_RAW_BALANCES } from '../../../test/fixtures/gateBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: GateAuthed,
    exchangeId: 'gate',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: GATE_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
