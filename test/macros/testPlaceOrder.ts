import { expect } from 'chai'
import { each } from 'lodash'
import { SinonStub } from 'sinon'
import { ImportMock } from 'ts-mock-imports'
import { IModule } from 'ts-mock-imports/lib/types'

import { IAlunaExchangeAuthed } from '../../src/lib/core/IAlunaExchange'
import { IAlunaHttp } from '../../src/lib/core/IAlunaHttp'
import { AlunaOrderSideEnum } from '../../src/lib/enums/AlunaOrderSideEnum'
import { IAlunaOrderPlaceParams } from '../../src/lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../src/lib/schemas/IAlunaSettingsSchema'
import { mockEnsureOrderIsSupported } from '../../src/utils/orders/ensureOrderIsSupported.mock'
import { placeOrderParamsSchema } from '../../src/utils/validation/schemas/placeOrderParamsSchema'
import { mockValidateParams } from '../../src/utils/validation/validateParams.mock'
import { PARSED_ORDERS } from '../fixtures/parsedOrders'
import { getImplementedAccounts } from '../helpers/getImplementedAccounts'
import { getImplementedOrderTypes } from '../helpers/getImplementedOrderTypes'
import { mockHttp } from '../mocks/exchange/Http'
import { mockParse } from '../mocks/exchange/modules/mockParse'
import {
  commonPlaceParams,
  orderTypesParamsDict,
} from './fixtures'



export type TExchangeAuthedConstructor = {
  new (params: {
    credentials: IAlunaCredentialsSchema
    settings?: IAlunaSettingsSchema
  }): IAlunaExchangeAuthed
}



export type TExchangeHttpConstructor = {
  new (settings: IAlunaSettingsSchema): IAlunaHttp
}



export interface IMethodToMock {
  methodName: string
  methodResponse?: any
  methodModule: IModule
}



export interface IPlaceValidationCallbackParams {
  authedRequestStub: SinonStub
  exchange: IAlunaExchangeAuthed
  placeParams: IAlunaOrderPlaceParams
  mockedMethodsDictionary?: Record<string, SinonStub>
}



export const testPlaceOrder = async (params: {
  ExchangeAuthed: TExchangeAuthedConstructor
  HttpClass: TExchangeHttpConstructor
  parseModule: IModule
  rawOrders: any[]
  credentials: IAlunaCredentialsSchema
  settings?: IAlunaSettingsSchema
  methodsToMock?: IMethodToMock[]
  validationCallback: (params: IPlaceValidationCallbackParams) => void
}) => {

  const {
    HttpClass,
    ExchangeAuthed,
    parseModule,
    rawOrders,
    credentials,
    validationCallback,
    settings,
    methodsToMock,
  } = params

  const exchange = new ExchangeAuthed({ credentials })

  const { specs } = exchange

  const { name } = specs

  const { accounts } = getImplementedAccounts({ exchangeSpecs: specs })

  const { orderTypesDict } = getImplementedOrderTypes({
    exchangeSpecs: specs,
  })

  const sides = [
    AlunaOrderSideEnum.BUY,
    AlunaOrderSideEnum.SELL,
  ]

  const rawOrdersLength = rawOrders.length

  let testCount = 0
  afterEach(() => {
    testCount += 1
  })

  each(accounts, async (account) => {

    const orderTypes = orderTypesDict[account]

    each(orderTypes, async (type) => {

      each(sides, (side) => {

        it(`should place a ${name} ${account} ${side} ${type} order just fine`, async () => {

          // preparing data
          // index to use all items inside the array without exceeding its size
          const rawOrderIndex = (testCount % rawOrdersLength)
          const rawOrder = rawOrders[rawOrderIndex]

          const parsedOrder = PARSED_ORDERS[0]

          const placeParams: IAlunaOrderPlaceParams = {
            ...commonPlaceParams,
            ...orderTypesParamsDict[type],
            account,
            type,
            side,
            ...(testCount % 2 === 0 ? { reduceOnly: true } : {}),
          }


          // mocking
          const {
            authedRequest: authedRequestStub,
            publicRequest,
          } = mockHttp({ classPrototype: HttpClass.prototype })
          authedRequestStub.returns(Promise.resolve(rawOrder))

          const { parse } = mockParse({ module: parseModule })
          parse.returns({ order: parsedOrder })

          const { validateParamsMock } = mockValidateParams()
          const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

          const mockedMethodsDictionary = {}
          each(methodsToMock, (methodToMock) => {

            const {
              methodName,
              methodModule,
              methodResponse,
            } = methodToMock

            const stub = ImportMock.mockFunction(
              methodModule,
              methodName,
              methodResponse,
            )

            mockedMethodsDictionary[methodName] = stub

          })


          // executing
          const exchange = new ExchangeAuthed({
            credentials,
            ...(testCount % 2 === 0 ? { settings } : {}),
          })

          const { order } = await exchange.order.place(placeParams)


          // validating
          expect(order).to.deep.eq(parsedOrder)

          expect(authedRequestStub.callCount).to.be.eq(1)

          expect(validateParamsMock.callCount).to.be.eq(1)
          expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
            params: placeParams,
            schema: placeOrderParamsSchema,
          })

          expect(ensureOrderIsSupported.callCount).to.be.eq(1)
          expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
            exchangeSpecs: exchange.specs,
            orderParams: placeParams,
          })

          expect(publicRequest.callCount).to.be.eq(0)

          validationCallback({
            placeParams,
            authedRequestStub,
            exchange,
            mockedMethodsDictionary,
          })

        })

      })

    })

  })

}

