import { expect } from 'chai'
import { each } from 'lodash'
import { ImportMock } from 'ts-mock-imports'
import { IModule } from 'ts-mock-imports/lib/types'

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
  TExchangeAuthedConstructor,
  TExchangeHttpConstructor,
} from './testPlaceOrder'



export interface IEditValidationCallbackParams extends Omit<IPlaceValidationCallbackParams, 'placeParams'> {
  editParams: IAlunaOrderEditParams
}



export const testEditOrder = async (params: {
  ExchangeAuthed: TExchangeAuthedConstructor
  HttpClass: TExchangeHttpConstructor
  parseImportPath: IModule
  rawOrders: any[]
  credentials: IAlunaCredentialsSchema
  methodsToMock?: IMethodToMock[]
  settings?: IAlunaSettingsSchema
  validationCallback: (params: IEditValidationCallbackParams) => void
}) => {

  const {
    HttpClass,
    ExchangeAuthed,
    parseImportPath,
    rawOrders,
    credentials,
    validationCallback,
    settings,
    methodsToMock,
  } = params

  const exchange = new ExchangeAuthed({
    credentials,
    settings,
  })

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

      if (type === AlunaOrderTypesEnum.MARKET) return

      each(sides, (side) => {

        it(`should edit a ${name} ${account} ${side} ${type} order just fine`, async () => {

          // preparing data
          // index to use all items inside the array without exceeding its size
          const rawOrderIndex = (testCount % rawOrdersLength)
          const rawOrder = rawOrders[rawOrderIndex]

          const parsedOrder = PARSED_ORDERS[0]

          const editParams: IAlunaOrderEditParams = {
            ...commonEditParams,
            ...orderTypesParamsDict[type],
            account,
            type,
            side,
          }


          // mocking
          const {
            authedRequest: authedRequestStub,
            publicRequest,
          } = mockHttp({ classPrototype: HttpClass.prototype })
          authedRequestStub.returns(Promise.resolve(rawOrder))

          const { parse } = mockParse({ module: parseImportPath })
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

          const { order } = await exchange.order.edit(editParams)


          // validating
          expect(order).to.deep.eq(parsedOrder)

          expect(authedRequestStub.callCount).to.be.eq(1)

          expect(validateParamsMock.callCount).to.be.eq(1)
          expect(validateParamsMock.firstCall.args[0]).to.deep.eq({
            params: editParams,
            schema: editOrderParamsSchema,
          })

          expect(ensureOrderIsSupported.callCount).to.be.eq(1)
          expect(ensureOrderIsSupported.firstCall.args[0]).to.deep.eq({
            exchangeSpecs: exchange.specs,
            orderParams: editParams,
          })

          expect(publicRequest.callCount).to.be.eq(0)

          validationCallback({
            editParams,
            authedRequestStub,
            exchange,
            mockedMethodsDictionary,
          })

        })

      })

    })

  })

}
