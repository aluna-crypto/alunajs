import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_BALANCES } from '../../../test/fixtures/ftxBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: FtxAuthed,
    exchangeId: 'ftx',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: FTX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
