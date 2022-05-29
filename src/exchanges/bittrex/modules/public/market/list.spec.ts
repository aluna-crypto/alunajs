import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BITTREX_RAW_MARKETS } from '../../../test/fixtures/bittrexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BittrexAuthed,
    exchangeId: 'bittrex',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: BITTREX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
