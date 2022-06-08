import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_MARKETS } from '../../../test/fixtures/bitfinexMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitfinexAuthed,
    exchangeId: 'bitfinex',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: BITFINEX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
