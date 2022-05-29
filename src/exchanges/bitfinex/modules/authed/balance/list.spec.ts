import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_BALANCES } from '../../../test/fixtures/bitfinexBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: BitfinexAuthed,
    exchangeId: 'bitfinex',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: BITFINEX_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
