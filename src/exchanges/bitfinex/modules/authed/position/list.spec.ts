import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { testList } from '../../../../../../test/macros/testList'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_POSITIONS } from '../../../test/fixtures/bitfinexPosition'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitfinexAuthed,
    exchangeId: 'bitfinex',
    methodModuleName: 'position',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawPositions: BITFINEX_RAW_POSITIONS },
    parsedList: { positions: PARSED_POSITIONS },
  })

})
