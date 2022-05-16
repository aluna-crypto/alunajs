import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_SYMBOLS } from '../../../test/fixtures/ftxSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: FTX_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
