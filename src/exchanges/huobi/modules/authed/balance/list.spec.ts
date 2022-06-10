import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { HuobiAuthed } from '../../../HuobiAuthed'
import { HUOBI_RAW_BALANCES } from '../../../test/fixtures/huobiBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: HuobiAuthed,
    exchangeId: 'huobi',
    methodModuleName: 'balance',
    listRawModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: HUOBI_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
