import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitfinexAuthed } from '../../../BitfinexAuthed'
import { BITFINEX_RAW_POSITIONS } from '../../../test/fixtures/bitfinexPosition'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should parse many Bitfinex raw positions just fine', async () => {

    // preparing data
    const parsedPositions = PARSED_POSITIONS
    const rawPositions = cloneDeep(BITFINEX_RAW_POSITIONS.slice(0, parsedPositions.length + 1))

    rawPositions[0][0] = 'F0BTC:ETH' // skiping symbol


    // mocking
    const { parse } = mockParse({ module: parseMod })

    each(parsedPositions, (position, index) => {
      parse.onCall(index).returns({ position })
    })


    // executing
    const exchange = new BitfinexAuthed({ credentials })

    const { positions } = exchange.position!.parseMany({ rawPositions })


    // validating
    expect(positions).to.deep.eq(parsedPositions)

    expect(parse.callCount).to.be.eq(parsedPositions.length)

  })

})
