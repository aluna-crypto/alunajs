import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_MARKETS } from '../../../test/fixtures/ftxMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: FTX_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
