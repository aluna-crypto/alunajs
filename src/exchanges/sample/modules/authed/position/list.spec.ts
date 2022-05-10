import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { testList } from '../../../../../../test/macros/testList'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_POSITIONS } from '../../../test/fixtures/samplePositions'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: SampleAuthed,
    exchangeId: 'sample',
    methodModuleName: 'position',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawPositions: SAMPLE_RAW_POSITIONS },
    parsedList: { positions: PARSED_POSITIONS },
  })

})
