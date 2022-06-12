import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_MARKETS } from '../../../test/fixtures/bitmexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitmexAuthed,
    exchangeId: 'bitmex',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: BITMEX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
