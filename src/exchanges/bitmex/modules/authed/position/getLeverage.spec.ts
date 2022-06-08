import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'

import { mockGetRaw } from '../../../../../../test/mocks/exchange/modules/mockGetRaw'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaPositionErrorCodes } from '../../../../../lib/errors/AlunaPositionErrorCodes'
import { IAlunaPositionGetLeverageParams } from '../../../../../lib/modules/authed/IAlunaPositionModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
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
      getRaw.returns(Promise.resolve({ rawPosition: { bitmexPosition } }))


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

  it(
    'should return leverage 0 if no position was found for given symbolPair',
    async () => {

      // preparing data
      const bitmexPosition = BITMEX_RAW_POSITIONS[0]

      // preparing data
      const alunaError = new AlunaError({
        code: AlunaPositionErrorCodes.NOT_FOUND,
        message: 'Position not found',
        httpStatusCode: 500,
      })


      // mocking
      const { getRaw } = mockGetRaw({ module: getRawMod })
      getRaw.returns(Promise.reject(alunaError))


      // executing
      const exchange = new BitmexAuthed({
        credentials,
      })

      const params: IAlunaPositionGetLeverageParams = {
        symbolPair: bitmexPosition.symbol,
      }

      const { leverage } = await exchange.position!.getLeverage!(params)


      // validating
      expect(leverage).to.deep.eq(0)

      expect(getRaw.callCount).to.be.eq(1)
      expect(getRaw.firstCall.args[0]).to.deep.eq({
        http: new BitmexHttp({}),
        symbolPair: bitmexPosition.symbol,
      })

    },
  )

  it('should throw error if getRaw throws somehow', async () => {

    // preparing data
    const bitmexPosition = BITMEX_RAW_POSITIONS[0]


    // preparing data
    const alunaError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'unknown',
      httpStatusCode: 500,
    })


    // mocking
    const { getRaw } = mockGetRaw({ module: getRawMod })
    getRaw.returns(Promise.reject(alunaError))


    // executing
    const exchange = new BitmexAuthed({
      credentials,
    })

    const params: IAlunaPositionGetLeverageParams = {
      symbolPair: bitmexPosition.symbol,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.position!.getLeverage!(params))


    // validating
    expect(result).not.to.be.ok

    expect(error).to.deep.eq(alunaError)

    expect(getRaw.callCount).to.be.eq(1)
    expect(getRaw.firstCall.args[0]).to.deep.eq({
      http: new BitmexHttp({}),
      symbolPair: bitmexPosition.symbol,
    })

  })

})
