import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { testList } from '../../../../../../test/macros/testList'
import { SampleAuthed } from '../../../SampleAuthed'
import { SAMPLE_RAW_MARKETS } from '../../../test/fixtures/sampleMarket'
import * as listRawMod from './listRaw'
import * as parseManyMod from './parseMany'



describe(__filename, () => {

  testList({
    AuthedClass: SampleAuthed,
    exchangeId: 'sample',
    methodModuleName: 'market',
    listModule: listRawMod,
    parseManyModule: parseManyMod,
    rawList: { rawMarkets: SAMPLE_RAW_MARKETS },
    parsedList: { markets: PARSED_MARKETS },
  })

})
