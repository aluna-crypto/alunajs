import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_SYMBOLS } from '../../../test/fixtures/poloniexSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: PoloniexAuthed,
    exchangeId: 'poloniex',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: POLONIEX_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
