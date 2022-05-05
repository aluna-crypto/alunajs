import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { ValrAuthed } from '../../../ValrAuthed'
import { VALR_RAW_MARKETS } from '../../../test/fixtures/valrMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: VALR_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
