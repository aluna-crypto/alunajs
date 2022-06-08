import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { VALR_RAW_SYMBOLS } from '../../../test/fixtures/valrSymbols'
import { ValrAuthed } from '../../../ValrAuthed'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'symbol',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: VALR_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
