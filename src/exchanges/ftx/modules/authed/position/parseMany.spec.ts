import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Ftx positions just fine', async () => {

    // preparing data
    const parsedPositions = PARSED_POSITIONS

    const rawPositions = FTX_RAW_POSITIONS.slice(0, 3)
    rawPositions[0].size = 0



    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedPositions, (position, index) => {
      parse.onCall(index).returns({ position })
    })


    // executing
    const exchange = new FtxAuthed({ credentials })
    const { positions } = exchange.position!.parseMany({ rawPositions })


    // validating
    expect(positions).to.deep.eq(parsedPositions)

    expect(parse.callCount).to.be.eq(parsedPositions.length)

  })

})
