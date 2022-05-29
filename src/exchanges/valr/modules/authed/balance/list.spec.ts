import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { VALR_RAW_BALANCES } from '../../../test/fixtures/valrBalances'
import { ValrAuthed } from '../../../ValrAuthed'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: ValrAuthed,
    exchangeId: 'valr',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: VALR_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
