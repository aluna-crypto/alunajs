import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BITTREX_RAW_BALANCES } from '../../../test/fixtures/bittrexBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BittrexAuthed,
    exchangeId: 'bittrex',
    methodModuleName: 'balance',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: BITTREX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
