import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { binanceAuthed } from '../../../binanceAuthed'
import { BINANCE_RAW_MARKETS } from '../../../test/fixtures/binanceMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: binanceAuthed,
    exchangeId: 'binance',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: BINANCE_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
