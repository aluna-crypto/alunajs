import { expect } from 'chai'

import { PARSED_MARKETS } from '../../../../../../test/fixtures/parsedMarkets'
import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaPositionGetParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { IBitmexPositionSchema } from '../../../schemas/IBitmexPositionSchema'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get position just fine', async () => {

    // preparing data
    const bitmexPosition = BITMEX_RAW_POSITIONS[0]
    const parsedPosition = PARSED_POSITIONS[0]
    const market = PARSED_MARKETS[0]

    const rawPosition: IBitmexPositionSchema = {
      market,
      bitmexPosition,
    }


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawPosition }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ position: parsedPosition })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionGetParams = {
      symbolPair: bitmexPosition.symbol,
    }

    const { position } = await exchange.position!.get(params)


    // validating
    expect(position).to.deep.eq(parsedPosition)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      symbolPair: bitmexPosition.symbol,
      http: new BitmexHttp({}),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawPosition,
    })

  })

})
