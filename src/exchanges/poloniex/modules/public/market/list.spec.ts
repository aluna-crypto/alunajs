import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_MARKETS } from '../../../test/fixtures/poloniexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: PoloniexAuthed,
    exchangeId: 'poloniex',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: POLONIEX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
