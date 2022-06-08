import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_SYMBOLS } from '../../../test/fixtures/sampleSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: SampleAuthed,
    exchangeId: 'sample',
    methodModuleName: 'symbol',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: SAMPLE_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
