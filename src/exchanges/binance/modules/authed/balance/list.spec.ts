import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { BinanceAuthed } from '../../../BinanceAuthed'
import { BINANCE_RAW_BALANCES } from '../../../test/fixtures/binanceBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BinanceAuthed,
    exchangeId: 'binance',
    methodModuleName: 'balance',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: BINANCE_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
