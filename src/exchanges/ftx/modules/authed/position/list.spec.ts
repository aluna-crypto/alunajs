import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'position',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawPositions: FTX_RAW_POSITIONS },
    parsedList: { positions: PARSED_POSITIONS },
  })

})
