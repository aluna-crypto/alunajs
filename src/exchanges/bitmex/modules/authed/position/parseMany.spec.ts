import { expect } from 'chai'
import { each } from 'lodash'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { IBitmexPositionsSchema } from '../../../schemas/IBitmexPositionSchema'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bitmex positions just fine', async () => {

    // preparing data
    const markets = PARSED_MARKETS
    const parsedPositions = PARSED_POSITIONS
    const parsedPositionLength = parsedPositions.length
    const bitmexPositions = BITMEX_RAW_POSITIONS.slice(0, parsedPositionLength)



    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedPositions, (position, index) => {
      parse.onCall(index).returns({ position })
    })


    // executing
    const rawPositions: IBitmexPositionsSchema = {
      bitmexPositions,
      markets,
    }

    const exchange = new BitmexAuthed({ credentials })
    const { positions } = exchange.position!.parseMany({ rawPositions })


    // validating
    expect(positions).to.deep.eq(parsedPositions)

    expect(parse.callCount).to.be.eq(parsedPositions.length)

  })

})
