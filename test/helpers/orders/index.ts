import { expect } from 'chai'
import { map } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../src/lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../src/lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../src/lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../../src/lib/enums/AlunaOrderTypesEnum'
import {
  IAlunaOrderPlaceParams,
  IAlunaOrderWriteModule,
} from '../../../src/lib/modules/authed/IAlunaOrderModule'
import {
  IAlunaExchangeOrderOptionsSchema,
  IAlunaExchangeSchema,
} from '../../../src/lib/schemas/IAlunaExchangeSchema'
import { mockValidateParams } from '../../../src/utils/validation/validateParams.mock'



const runBeforeEach = () => {

  ImportMock.restore()

  mockValidateParams()

}



const accountIsOneOfExchangeAccounts = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params
  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [],
  )

  const account = 'nonexistent'

  try {

    await orderWriteModule.place({
      account,
    } as unknown as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Account type '${account}' not found`

  expect(error).to.be.ok

  const { message } = error as AlunaError
  expect(message).to.be.eq(msg)

}



const accountIsSupported = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  let error

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.EXCHANGE,
        supported: false,
        implemented: true,
        orderTypes: [],
      },
    ],
  )

  const account = AlunaAccountEnum.EXCHANGE

  try {

    await orderWriteModule.place({
      account,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Account type '${account}' not supported/implemented for ${exchangeSpecs.name}`

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(msg)

}



const accountIsImplemented = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.DERIVATIVES,
        supported: true,
        implemented: false,
        orderTypes: [],
      },
    ],
  )

  const account = AlunaAccountEnum.DERIVATIVES

  try {

    await orderWriteModule.place({
      account,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Account type '${account}' not supported/implemented for ${exchangeSpecs.name}`

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(msg)

}



const orderTypeIsOneOfAccountOrderTypes = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.DERIVATIVES,
        supported: true,
        implemented: true,
        orderTypes: [],
      },
    ],
  )

  const type = 'unsupported-type'

  try {

    await orderWriteModule.place({
      account: AlunaAccountEnum.DERIVATIVES,
      type: type as AlunaOrderTypesEnum,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Order type '${type}' not supported/implemented for ${exchangeSpecs.name}`

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(msg)

}



const orderTypeIsSupported = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.DERIVATIVES,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type: AlunaOrderTypesEnum.LIMIT,
            supported: false,
            implemented: false,
            mode: AlunaFeaturesModeEnum.WRITE,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ],
  )

  const type = AlunaOrderTypesEnum.LIMIT

  try {

    await orderWriteModule.place({
      account: AlunaAccountEnum.DERIVATIVES,
      type,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Order type '${type}' not supported/implemented for ${exchangeSpecs.name}`

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(msg)

}



const orderTypeIsImplemented = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.DERIVATIVES,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type: AlunaOrderTypesEnum.LIMIT,
            supported: true,
            implemented: false,
            mode: AlunaFeaturesModeEnum.WRITE,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ],
  )


  const type = AlunaOrderTypesEnum.LIMIT

  try {

    await orderWriteModule.place({
      account: AlunaAccountEnum.DERIVATIVES,
      type,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  const msg = `Order type '${type}' not supported/implemented for ${exchangeSpecs.name}`

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(msg)

}



const orderTypeIsInWriteMode = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const {
    exchangeSpecs,
    orderWriteModule,
  } = params

  let error

  ImportMock.mockOther(
    exchangeSpecs,
    'accounts',
    [
      {
        type: AlunaAccountEnum.DERIVATIVES,
        supported: true,
        implemented: true,
        orderTypes: [
          {
            type: AlunaOrderTypesEnum.LIMIT,
            supported: true,
            implemented: true,
            mode: AlunaFeaturesModeEnum.READ,
            options: {} as IAlunaExchangeOrderOptionsSchema,
          },
        ],
      },
    ],
  )

  const type = AlunaOrderTypesEnum.LIMIT

  try {

    await orderWriteModule.place({
      account: AlunaAccountEnum.DERIVATIVES,
      type,
    } as IAlunaOrderPlaceParams)

  } catch (err) {

    error = err

  }

  expect(error).to.be.ok

  const { message } = error
  expect(message).to.be.eq(`Order type '${type}' is in read mode`)

}



export const testExchangeSpecsForOrderWriteModule = async (params: {
  orderWriteModule: IAlunaOrderWriteModule
  exchangeSpecs: IAlunaExchangeSchema
}) => {

  const callbacks = [
    accountIsOneOfExchangeAccounts,
    accountIsSupported,
    accountIsImplemented,
    orderTypeIsOneOfAccountOrderTypes,
    orderTypeIsSupported,
    orderTypeIsImplemented,
    orderTypeIsInWriteMode,
  ]

  const callbackPromises = map(callbacks, async (callback) => {

    runBeforeEach()

    await callback(params)

  })

  await Promise.all(callbackPromises)


}
