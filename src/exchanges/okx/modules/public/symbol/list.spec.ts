import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_SYMBOLS } from '../../../test/fixtures/okxSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: OkxAuthed,
    exchangeId: 'okx',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: OKX_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
