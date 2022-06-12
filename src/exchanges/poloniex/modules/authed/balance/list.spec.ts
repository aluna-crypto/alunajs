import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { PoloniexAuthed } from '../../../PoloniexAuthed'
import { POLONIEX_RAW_BALANCES } from '../../../test/fixtures/poloniexBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: PoloniexAuthed,
    exchangeId: 'poloniex',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: POLONIEX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
