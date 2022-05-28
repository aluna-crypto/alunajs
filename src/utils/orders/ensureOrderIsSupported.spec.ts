import { expect } from 'chai'
import {
  random,
  values,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaAccountEnum } from '../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderSideEnum } from '../../lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../lib/enums/AlunaOrderTypesEnum'
import { AlunaAccountsErrorCodes } from '../../lib/errors/AlunaAccountsErrorCodes'
import { AlunaOrderErrorCodes } from '../../lib/errors/AlunaOrderErrorCodes'
import { IAlunaOrderPlaceParams } from '../../lib/modules/authed/IAlunaOrderModule'
import {
  IAlunaExchangeAccountSpecsSchema,
  IAlunaExchangeOrderOptionsSchema,
  IAlunaExchangeSchema,
} from '../../lib/schemas/IAlunaExchangeSchema'
import { executeAndCatch } from '../executeAndCatch'
import { ensureOrderIsSupported } from './ensureOrderIsSupported'



describe(__filename, () => {

  const exchangeSpecs: IAlunaExchangeSchema = {
    id: 'dummy',
    name: 'Dummy',
    signupUrl: 'http://dummy.com',
    connectApiUrl: 'http://dummy.com',
    rateLimitingPerMinute: {
      perApiKey: 100,
      perIp: 100,
    },
    features: {
      offersPositionId: false,
      offersOrderEditing: false,
    },
    accounts: [],
    settings: {},
  }

  const defaultOrderPlaceParams: IAlunaOrderPlaceParams = {
    account: AlunaAccountEnum.SPOT,
    type: AlunaOrderTypesEnum.LIMIT,
    side: AlunaOrderSideEnum.BUY,
    symbolPair: 'BTC_ETH',
    amount: 20,
    rate: 20,
  }


  const mockDeps = (params: {
    accounts: IAlunaExchangeAccountSpecsSchema[]
  }) => {

    const { accounts } = params

    ImportMock.mockOther(
      exchangeSpecs,
      'accounts',
      accounts,
    )

  }

  const pickRandomOrderAccount = (): AlunaAccountEnum => {

    const accounts = values(AlunaAccountEnum)

    const randomIndex = random(0, accounts.length - 1)

    return accounts[randomIndex]

  }

  const pickRandomOrderType = (): AlunaOrderTypesEnum => {

    const types = values(AlunaOrderTypesEnum)

    const randomIndex = random(0, types.length - 1)

    return types[randomIndex]

  }

  it(
    'should properly validate order account and type against exchange specs',
    async () => {

      // preparing data
      const account = pickRandomOrderAccount()
      const type = pickRandomOrderType()

      const accounts: IAlunaExchangeAccountSpecsSchema[] = [
        {
          type: account,
          supported: true,
          implemented: true,
          orderTypes: [
            {
              type,
              supported: true,
              implemented: true,
              mode: AlunaFeaturesModeEnum.WRITE,
              options: {} as IAlunaExchangeOrderOptionsSchema,
            },
          ],
        },
      ]


      // mocking
      mockDeps({ accounts })


      // executing
      const orderPlaceParams: IAlunaOrderPlaceParams = {
        ...defaultOrderPlaceParams,
        account,
        type,
      }

      const { error } = await executeAndCatch(() => ensureOrderIsSupported({
        exchangeSpecs,
        orderParams: orderPlaceParams,
      }))


      // validating
      expect(error).not.to.be.ok

    },
  )

  it('should ensure order account is one of exchange accounts', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = []


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not found`

    expect(error!.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_FOUND)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order account is implemented', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: true,
        implemented: false,
        orderTypes: [],
      },
    ]


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented `
      .concat(`for ${exchangeSpecs.name}`)

    expect(error!.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order account is supported', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: false,
        implemented: true,
        orderTypes: [],
      },
    ]


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Account type '${account}' not supported/implemented `
      .concat(`for ${exchangeSpecs.name}`)

    expect(error!.code).to.be.eq(AlunaAccountsErrorCodes.TYPE_NOT_SUPPORTED)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order type is one of exchange order types', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: true,
        implemented: true,
        orderTypes: [],
      },
    ]


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }


    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for `
      .concat(`${exchangeSpecs.name}`)

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order type is supported by exchange', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type,
            supported: false,
            implemented: true,
            mode: AlunaFeaturesModeEnum.WRITE,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ]

    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for `
      .concat(`${exchangeSpecs.name}`)

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order type is implemented by exchange', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type,
            supported: true,
            implemented: false,
            mode: AlunaFeaturesModeEnum.WRITE,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ]


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Order type '${type}' not supported/implemented for `
      .concat(`${exchangeSpecs.name}`)

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.TYPE_NOT_SUPPORTED)
    expect(error!.message).to.be.eq(msg)

  })

  it('should ensure order type is in write mode', async () => {

    // preparing data
    const account = pickRandomOrderAccount()
    const type = pickRandomOrderType()

    const accounts: IAlunaExchangeAccountSpecsSchema[] = [
      {
        type: account,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type,
            supported: true,
            implemented: true,
            mode: AlunaFeaturesModeEnum.READ,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ]


    // mocking
    mockDeps({ accounts })


    // executing
    const orderPlaceParams: IAlunaOrderPlaceParams = {
      ...defaultOrderPlaceParams,
      account,
      type,
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => ensureOrderIsSupported({
      exchangeSpecs,
      orderParams: orderPlaceParams,
    }))


    // validating
    expect(result).not.to.be.ok

    const msg = `Order type '${type}' is in read mode`

    expect(error!.code).to.be.eq(AlunaOrderErrorCodes.TYPE_IS_READ_ONLY)
    expect(error!.message).to.be.eq(msg)

  })

})
