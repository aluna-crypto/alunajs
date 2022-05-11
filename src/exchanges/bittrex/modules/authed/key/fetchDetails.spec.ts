import { expect } from 'chai'
import { each } from 'lodash'

import { mockHttp } from '../../../../../../test/mocks/exchange/Http'
import { mockParseDetails } from '../../../../../../test/mocks/exchange/modules/key/mockParseDetails'
import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaGenericErrorCodes } from '../../../../../lib/errors/AlunaGenericErrorCodes'
import { AlunaHttpErrorCodes } from '../../../../../lib/errors/AlunaHttpErrorCodes'
import { IAlunaKeyFetchDetailsReturns } from '../../../../../lib/modules/authed/IAlunaKeyModule'
import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaKeySchema } from '../../../../../lib/schemas/IAlunaKeySchema'
import { executeAndCatch } from '../../../../../utils/executeAndCatch'
import { BittrexAuthed } from '../../../BittrexAuthed'
import { BittrexHttp } from '../../../BittrexHttp'
import { getBittrexEndpoints } from '../../../bittrexSpecs'
import { BittrexOrderSideEnum } from '../../../enums/BittrexOrderSideEnum'
import { BittrexOrderTimeInForceEnum } from '../../../enums/BittrexOrderTimeInForceEnum'
import { BittrexOrderTypeEnum } from '../../../enums/BittrexOrderTypeEnum'
import * as parseDetailsMod from './parseDetails'



describe(__filename, () => {

  it('should fetch Bittrex key details just fine', async () => {

    // preparing data
    const http = new BittrexHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: true,
      },
      meta: {},
    }

    // mocking
    const {
      publicRequest,
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const badReqError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'BAD_REQUEST',
      httpStatusCode: 400,
      metadata: {
        code: 'BAD_REQUEST',
      },
    })

    const requestResponses = [
      Promise.resolve(true),
      Promise.reject(badReqError),
      Promise.resolve({ accountId }),
    ]

    each(requestResponses, (r, i) => authedRequest.onCall(i).returns(r))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new BittrexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails({ http })


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(authedRequest.callCount).to.be.eq(3)
    expect(authedRequest.firstCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBittrexEndpoints(exchange.settings).balance.list,
      credentials,
    })
    expect(authedRequest.secondCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.POST,
      url: getBittrexEndpoints(exchange.settings).order.place,
      credentials,
      body: {
        marketSymbol: 'BTCEUR',
        direction: BittrexOrderSideEnum.BUY,
        type: BittrexOrderTypeEnum.MARKET,
        quantity: 0,
        timeInForce: BittrexOrderTimeInForceEnum.GOOD_TIL_CANCELLED,
        useAwards: false,
      },
    })

    expect(authedRequest.thirdCall.args[0]).to.deep.eq({
      verb: AlunaHttpVerbEnum.GET,
      url: getBittrexEndpoints(exchange.settings).key.account,
      credentials,
    })

    expect(publicRequest.callCount).to.be.eq(0)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        accountId,
        read: true,
        trade: true,
        withdraw: false,
      },
    })

  })

  it('should properly verify if key has permission to read', async () => {

    // preparing data
    const http = new BittrexHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: true,
      },
      meta: {},
    }

    // mocking
    const {
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const invalidPerError = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'INVALID_PERMISSION',
      httpStatusCode: 400,
      metadata: {
        code: 'INVALID_PERMISSION',
      },
    })

    const badReqError = new AlunaError({
      code: AlunaGenericErrorCodes.UNKNOWN,
      message: 'BAD_REQUEST',
      httpStatusCode: 400,
      metadata: {
        code: 'BAD_REQUEST',
      },
    })

    const requestResponses = [
      Promise.reject(invalidPerError),
      Promise.reject(badReqError),
      Promise.resolve({ accountId }),
    ]

    each(requestResponses, (r, i) => authedRequest.onCall(i).returns(r))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new BittrexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails({ http })


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        accountId,
        read: false,
        trade: true,
        withdraw: false,
      },
    })

  })

  it('should properly verify if key has permission to trade', async () => {

    // preparing data
    const http = new BittrexHttp({})

    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const accountId = 'accountId'

    const parsedKey: IAlunaKeySchema = {
      accountId,
      permissions: {
        read: true,
        trade: true,
        withdraw: true,
      },
      meta: {},
    }

    // mocking
    const {
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const invalidPerError = new AlunaError({
      code: AlunaGenericErrorCodes.PARAM_ERROR,
      message: 'INVALID_PERMISSION',
      httpStatusCode: 400,
      metadata: {
        code: 'INVALID_PERMISSION',
      },
    })

    const requestResponses = [
      Promise.resolve(true),
      Promise.reject(invalidPerError),
      Promise.resolve({ accountId }),
    ]

    each(requestResponses, (r, i) => authedRequest.onCall(i).returns(r))


    const { parseDetails } = mockParseDetails({
      module: parseDetailsMod,
    })

    parseDetails.returns({ key: parsedKey })


    // executing
    const exchange = new BittrexAuthed({ settings: {}, credentials })

    const {
      key,
      requestWeight,
    } = await exchange.key.fetchDetails({ http })


    // validating
    expect(key).to.be.eq(key)

    expect(requestWeight).to.deep.eq(http.requestWeight)

    expect(parseDetails.firstCall.args[0]).to.deep.eq({
      rawKey: {
        accountId,
        read: true,
        trade: false,
        withdraw: false,
      },
    })

  })

  it(
    'should handle request error when trying fetch key read details',
    async () => {

      // preparing data
      const credentials: IAlunaCredentialsSchema = {
        key: 'key',
        secret: 'secret',
      }

      const exchange = new BittrexAuthed({ settings: {}, credentials })

      const requestError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: 'unkown error.',
        httpStatusCode: 400,
      })


      // mocking
      const {
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      authedRequest.returns(Promise.reject(requestError))


      // executing
      const {
        error,
        result,
      } = await executeAndCatch<IAlunaKeyFetchDetailsReturns>(
        () => exchange.key.fetchDetails(),
      )


      // validating
      expect(result).not.to.be.ok

      expect(error!).to.deep.eq(requestError)

    },
  )

  it(
    'should handle request error when trying fetch key trade details',
    async () => {

      // preparing data
      const credentials: IAlunaCredentialsSchema = {
        key: 'key',
        secret: 'secret',
      }

      const exchange = new BittrexAuthed({ settings: {}, credentials })

      const requestError = new AlunaError({
        code: AlunaHttpErrorCodes.REQUEST_ERROR,
        message: 'unkown error.',
        httpStatusCode: 400,
      })


      // mocking
      const {
        authedRequest,
      } = mockHttp({ classPrototype: BittrexHttp.prototype })

      const requestResponses = [
        Promise.resolve(true),
        Promise.reject(requestError),
      ]

      each(requestResponses, (r, i) => authedRequest.onCall(i).returns(r))


      // executing
      const {
        error,
        result,
      } = await executeAndCatch<IAlunaKeyFetchDetailsReturns>(
        () => exchange.key.fetchDetails(),
      )


      // validating
      expect(result).not.to.be.ok

      expect(error!).to.deep.eq(requestError)

    },
  )

  it('should handle request error when trying fetch account id', async () => {

    // preparing data
    const credentials: IAlunaCredentialsSchema = {
      key: 'key',
      secret: 'secret',
    }

    const exchange = new BittrexAuthed({ settings: {}, credentials })

    const requestError = new AlunaError({
      code: AlunaHttpErrorCodes.REQUEST_ERROR,
      message: 'unkown error.',
      httpStatusCode: 400,
    })


    // mocking
    const {
      authedRequest,
    } = mockHttp({ classPrototype: BittrexHttp.prototype })

    const requestResponses = [
      Promise.resolve(true),
      Promise.resolve(true),
      Promise.reject(requestError),
    ]

    each(requestResponses, (r, i) => authedRequest.onCall(i).returns(r))


    // executing
    const {
      error,
      result,
    } = await executeAndCatch<IAlunaKeyFetchDetailsReturns>(
      () => exchange.key.fetchDetails(),
    )


    // validating
    expect(result).not.to.be.ok

    expect(error!).to.deep.eq(requestError)

  })

})
