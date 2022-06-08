import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_BALANCES } from '../../../test/fixtures/bitmexBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitmexAuthed,
    exchangeId: 'bitmex',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: BITMEX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
