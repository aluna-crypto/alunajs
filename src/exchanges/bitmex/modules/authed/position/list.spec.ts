import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { testList } from '../../../../../../test/macros/testList'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitmexAuthed,
    exchangeId: 'bitmex',
    methodModuleName: 'position',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawPositions: BITMEX_RAW_POSITIONS },
    parsedList: { positions: PARSED_POSITIONS },
  })

})
