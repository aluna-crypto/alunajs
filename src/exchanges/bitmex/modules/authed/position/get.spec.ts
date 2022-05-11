import { expect } from 'chai'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaPositionGetParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
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
    const mockedRawPosition = BITMEX_RAW_POSITIONS[0]
    const mockedParsedPosition = PARSED_POSITIONS[0]

    const { id } = mockedRawPosition


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawPosition: mockedRawPosition }))

    const { parse } = mockParse({ module: parseMod })

    parse.returns({ position: mockedParsedPosition })


    // executing
    const exchange = new BitmexAuthed({ credentials })

    const params: IAlunaPositionGetParams = {
      id,
      symbolPair: mockedRawPosition[0],
    }

    const { position } = await exchange.position!.get(params)


    // validating
    expect(position).to.deep.eq(mockedParsedPosition)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      id,
      http: new BitmexHttp({}),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawPosition: mockedRawPosition,
    })

  })

})
