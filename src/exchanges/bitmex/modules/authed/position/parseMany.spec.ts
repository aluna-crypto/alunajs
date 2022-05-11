import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many positions just fine', async () => {

    // preparing data
    const parsedPositions = PARSED_POSITIONS
    const rawPositions = BITMEX_RAW_POSITIONS


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedPositions, (position, index) => {
      parse.onCall(index).returns({ position })
    })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const { positions } = exchange.position!.parseMany({ rawPositions })


    // validating
    expect(positions).to.deep.eq(parsedPositions)

    expect(parse.callCount).to.be.eq(rawPositions.length)

  })

})
