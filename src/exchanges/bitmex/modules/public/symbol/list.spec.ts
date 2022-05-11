import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_SYMBOLS } from '../../../test/fixtures/bitmexSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitmexAuthed,
    exchangeId: 'bitmex',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: BITMEX_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
