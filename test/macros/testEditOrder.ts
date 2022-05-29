import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaOrderSideEnum } from '../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../src/lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../src/lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../src/lib/schemas/IAlunaSettingsSchema'
import { mockEnsureOrderIsSupported } from '../../src/utils/orders/ensureOrderIsSupported.mock'
import { editOrderParamsSchema } from '../../src/utils/validation/schemas/editOrderParamsSchema'
import { mockValidateParams } from '../../src/utils/validation/validateParams.mock'
import { PARSED_ORDERS } from '../fixtures/parsedOrders'
import { getImplementedAccounts } from '../helpers/getImplementedAccounts'
import { getImplementedOrderTypes } from '../helpers/getImplementedOrderTypes'
import { mockHttp } from '../mocks/exchange/Http'
import { mockParse } from '../mocks/exchange/modules/mockParse'
import {
  commonEditParams,
  orderTypesParamsDict,
} from './fixtures'
import {
  IMethodToMock,
  IPlaceValidationCallbackParams,
  TExchangeAuthed,
  TExchangeHttp,
} from './testPlaceOrder'



export interface IEditValidationCallbackParams extends Omit<IPlaceValidationCallbackParams, 'placeParams'> {
  editParams: IAlunaOrderEditParams
}



export const testEditOrder = async (params: {
  ExchangeAuthed: TExchangeAuthed
  HttpClass: TExchangeHttp
  parseImportPath: any
  mockedOrders: any[]
  credentials: IAlunaCredentialsSchema
  methodsToMock?: IMethodToMock[]
  settings?: IAlunaSettingsSchema
  validationCallback: (params: IEditValidationCallbackParams) => void
}) => {

  const {
    HttpClass,
    ExchangeAuthed,
    parseImportPath,
    mockedOrders,
    credentials,
    validationCallback: validateAuthedRequest,
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

  const mockedOrdersLength = mockedOrders.length
  let testCount = 0

  afterEach(() => {
    testCount += 1
  })

  each(accounts, async (account) => {

    const orderTypes = orderTypesDict[account]

    each(orderTypes, async (type) => {

      if (type === AlunaOrderTypesEnum.MARKET) return

      each(sides, (side) => {

        it(`should edit a ${name} ${account} ${side} ${type} order just fine`, async () => {

          // preparing data
          // index to use all items inside the array without exceeding its size
          const mockedOrderIndex = (testCount % mockedOrdersLength)
          const mockedOrder = mockedOrders[mockedOrderIndex]

          const mockedParsedOrder = PARSED_ORDERS[0]

          const params: IAlunaOrderEditParams = {
            ...commonEditParams,
            ...orderTypesParamsDict[type],
            account,
            type,
            side,
          }


          // mocking
          const {
            authedRequest,
            publicRequest,
          } = mockHttp({ classPrototype: HttpClass.prototype })
          authedRequest.returns(Promise.resolve(mockedOrder))

          const { parse } = mockParse({ module: parseImportPath })
          parse.returns({ order: mockedParsedOrder })

          const { validateParamsMock } = mockValidateParams()
          const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()

          const mockedMethodsDictionary = {}
          each(methodsToMock, (methodToMock) => {

            const {
              methodName,
              methodPath,
              methodResponse,
            } = methodToMock

            const stub = ImportMock.mockFunction(
              methodPath,
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

          const { order } = await exchange.order.edit(params)


          // validating
          expect(order).to.deep.eq(mockedParsedOrder)

          expect(authedRequest.callCount).to.be.eq(1)

          expect(validateParamsMock.callCount).to.be.eq(1)
          expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
            params,
            schema: editOrderParamsSchema,
          })

          expect(ensureOrderIsSupported.callCount).to.be.eq(1)
          expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
            exchangeSpecs: exchange.specs,
            orderParams: params,
          })

          expect(publicRequest.callCount).to.be.eq(0)

          validateAuthedRequest({
            editParams: params,
            authedRequestStub: authedRequest,
            exchange,
            mockedMethodsDictionary,
          })

        })

      })

    })

  })

}
