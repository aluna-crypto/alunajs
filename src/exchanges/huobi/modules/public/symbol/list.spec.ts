import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_SYMBOLS } from '../../../test/fixtures/huobiSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: HuobiAuthed,
    exchangeId: 'huobi',
    methodModuleName: 'symbol',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: HUOBI_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
