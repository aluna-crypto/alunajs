import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { testList } from '../../../../../../test/macros/testList'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: OkxAuthed,
    exchangeId: 'okx',
    methodModuleName: 'position',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawPositions: OKX_RAW_POSITIONS },
    parsedList: { positions: PARSED_POSITIONS },
  })

})
