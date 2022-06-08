import { expect } from 'chai'

import { PARSED_POSITIONS } from '../../../../../../test/fixtures/parsedPositions'
import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { mockParse } from '../../../../../../test/mocks/exchange/modules/mockParse'
import { IAlunaPositionGetParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'
import * as getRawMod from './getRaw'
import * as parseMod from './parse'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should get Ftx position just fine', async () => {

    // preparing data
    const rawPosition = FTX_RAW_POSITIONS[0]
    const parsedPosition = PARSED_POSITIONS[0]


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.resolve({ rawPosition }))

    const { parse } = mockParse({ module: parseMod })
    parse.returns({ position: parsedPosition })


    // executing
    const exchange = new FtxAuthed({ credentials })

    const params: IAlunaPositionGetParams = {
      symbolPair: rawPosition.future,
    }

    const { position } = await exchange.position!.get(params)


    // validating
    expect(position).to.deep.eq(parsedPosition)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      symbolPair: rawPosition.future,
      http: new FtxHttp(exchange.settings),
    })

    expect(parse.callCount).to.be.eq(1)
    expect(parse.firstCall.args[0]).to.deep.eq({
      rawPosition,
    })

  })

})
