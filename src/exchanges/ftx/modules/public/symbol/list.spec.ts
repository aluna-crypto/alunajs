import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'symbol',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: FTX_RAW_MARKETS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
