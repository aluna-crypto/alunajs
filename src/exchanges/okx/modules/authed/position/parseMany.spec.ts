import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { OkxAuthed } from '../../../OkxAuthed'
import { OKX_RAW_POSITIONS } from '../../../test/fixtures/okxPositions'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many positions just fine', async () => {

    // preparing data
    const parsedPositions = PARSED_POSITIONS
    const rawPositions = OKX_RAW_POSITIONS


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedPositions, (position, index) => {
      parse.onCall(index).returns({ position })
    })


    // executing
    const exchange = new OkxAuthed({ credentials })

    const { positions } = exchange.position!.parseMany({ rawPositions })


    // validating
    expect(positions).to.deep.eq(parsedPositions)

    expect(parse.callCount).to.be.eq(rawPositions.length)

  })

})
