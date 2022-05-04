import { PARSED_BALANCES } from '../../../../../../test/fixtures/parsedBalances'
import { testList } from '../../../../../../test/macros/testList'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_BALANCES } from '../../../test/fixtures/sampleBalances'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: SampleAuthed,
    exchangeId: 'sample',
    methodModuleName: 'balance',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawBalances: SAMPLE_RAW_BALANCES },
    parsedList: { balances: PARSED_BALANCES },
  })

})
