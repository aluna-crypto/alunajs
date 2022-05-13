import { PARSED_SYMBOLS } from '../../../../../../test/fixtures/parsedSymbols'
import { testList } from '../../../../../../test/macros/testList'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BINANCE_RAW_SYMBOLS } from '../../../test/fixtures/binanceSymbols'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BinanceAuthed,
    exchangeId: 'binance',
    methodModuleName: 'symbol',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawSymbols: BINANCE_RAW_SYMBOLS },
    parsedList: { symbols: PARSED_SYMBOLS },
  })

})
