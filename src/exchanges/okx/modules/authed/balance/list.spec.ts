import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_BALANCES } from '../../../test/fixtures/okxBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: OkxAuthed,
    exchangeId: 'okx',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: OKX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
