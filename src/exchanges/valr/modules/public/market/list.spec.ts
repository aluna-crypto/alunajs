import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'
import { ValrAuthed } from '../../../ValrAuthed'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: VALR_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
