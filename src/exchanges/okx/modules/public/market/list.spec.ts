import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_MARKETS } from '../../../test/fixtures/okxMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: OkxAuthed,
    exchangeId: 'okx',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: OKX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
