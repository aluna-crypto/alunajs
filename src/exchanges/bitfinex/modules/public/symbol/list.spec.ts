import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_SYMBOLS } from '../../../test/fixtures/bitfinexSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitfinexAuthed,
    exchangeId: 'bitfinex',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: BITFINEX_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
