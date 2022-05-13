import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { IAlunaPositionGetLeverageParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { BitmexAuthed } from '../../../BitmexAuthed'
import { BitmexHttp } from '../../../BitmexHttp'
import { BITMEX_RAW_POSITIONS } from '../../../test/fixtures/bitmexPositions'
import * as getRawMod from './getRaw'



describe(__filename, () => {

  const credentials: IAlunaCredentialsSchema = {
    key: 'key',
    secret: 'secret',
  }

  const testsCasesParams: Array<[string, boolean]> = [
    ['(LEVERAGE)', true],
    ['(W/O LEVERAGE)', false],
  ]

  each(testsCasesParams, (params) => {

    const [testCase, crossMargin] = params

    it(`should get leverage just fine ${testCase}`, async () => {

      // preparing data
      const bitmexPosition = cloneDeep(BITMEX_RAW_POSITIONS[0])
      bitmexPosition.crossMargin = crossMargin


      // mocking
      const { getRaw } = mockGetRaw({ module: getRawMod })
      getRaw.returns({ rawPosition: { bitmexPosition } })


      // executing
      const exchange = new BitmexAuthed({
        credentials,
      })

      const params: IAlunaPositionGetLeverageParams = {
        symbolPair: bitmexPosition.symbol,
      }

      const { leverage } = await exchange.position!.getLeverage!(params)


      // validating
      const expectedLeverage = crossMargin
        ? 0
        : bitmexPosition.leverage

      expect(leverage).to.deep.eq(expectedLeverage)

      expect(getRaw.callCount).to.be.eq(1)
      expect(getRaw.firstCall.args[0]).to.deep.eq({
        http: new BitmexHttp({}),
        symbolPair: bitmexPosition.symbol,
      })

    })

  })

})
