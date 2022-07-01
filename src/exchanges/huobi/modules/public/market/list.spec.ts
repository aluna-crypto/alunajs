import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_MARKETS } from '../../../test/fixtures/huobiMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: HuobiAuthed,
    exchangeId: 'huobi',
    methodModuleName: 'market',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: HUOBI_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
