import { expect } from 'chai'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../../../../lib/schemas/IAlunaSettingsSchema'
import { FtxAuthed } from '../../../FtxAuthed'
import { FtxHttp } from '../../../FtxHttp'
import { getFtxEndpoints } from '../../../ftxSpecs'
import { FTX_RAW_POSITIONS } from '../../../test/fixtures/ftxPositions'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  it('should list Ftx raw positions just fine', async () => {

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: FtxHttp.prototype })

    authedRequest.returns(Promise.resolve(FTX_RAW_POSITIONS))


    // executing
    const settings: IAlunaSettingsSchema = {}
    const exchange = new FtxAuthed({ credentials, settings })

    const { rawPositions } = await exchange.position!.listRaw()


    // validating
    expect(rawPositions).to.deep.eq(FTX_RAW_POSITIONS)

    expect(authedRequest.callCount).to.be.eq(1)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      credentials,
      verb: AlunaHttpVerbEnum.GET,
      url: getFtxEndpoints(settings).position.list,
    })

    expect(publicRequest.callCount).to.be.eq(0)

  })

})
