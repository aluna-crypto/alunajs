import { expect } from 'chai'
import { each } from 'lodash'
import { SinonStub } from 'sinon'

import { AlunaOrderSideEnum } from '../../src/lib/enums/AlunaOrderSideEnum'
import { AlunaOrderTypesEnum } from '../../src/lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderEditParams } from '../../src/lib/modules/authed/IAlunaOrderModule'
import { IAlunaCredentialsSchema } from '../../src/lib/schemas/IAlunaCredentialsSchema'
import { mockEnsureOrderIsSupported } from '../../src/utils/orders/ensureOrderIsSupported.mock'
import { editOrderParamsSchema } from '../../src/utils/validation/schemas/editOrderParamsSchema'
import { mockValidateParams } from '../../src/utils/validation/validateParams.mock'
import { PARSED_ORDERS } from '../fixtures/parsedOrders'
import { getImplementedAccounts } from '../helpers/getImplementedAccounts'
import { getImplementedOrderTypes } from '../helpers/getImplementedOrderTypes'
import { mockHttp } from '../mocks/exchange/Http'
import { mockParse } from '../mocks/exchange/modules/mockParse'



export interface IValidateAuthedRequestParams {
  editParams: IAlunaOrderEditParams
  stub: SinonStub
}


export const testEditOrder = async (params: {
  ExchangeAuthed: any
  HttpClass: any
  parseImportPath: any
  authedRequestResponse: any
  credentials: IAlunaCredentialsSchema
  validateAuthedRequest: (params: IValidateAuthedRequestParams) => void
}) => {

  const {
    HttpClass,
    ExchangeAuthed,
    parseImportPath,
    authedRequestResponse,
    credentials,
    validateAuthedRequest,
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

  const commonParams: Partial<IAlunaOrderEditParams> = {
    id: 'id',
    amount: 100,
    symbolPair: 'BTC/USD',
  }

  const orderTypesParamsDict = {
    [AlunaOrderTypesEnum.LIMIT]: {
      rate: 10,
    },
    [AlunaOrderTypesEnum.MARKET]: {},
    [AlunaOrderTypesEnum.STOP_MARKET]: {
      stopRate: 11,
    },
    [AlunaOrderTypesEnum.STOP_LIMIT]: {
      stopRate: 11,
      limitRate: 12,
    },
  }

  each(accounts, async (account) => {

    const orderTypes = orderTypesDict[account]

    each(orderTypes, async (type) => {

      if (type === AlunaOrderTypesEnum.MARKET) return

      each(sides, (side) => {

        it(`should edit a ${name} ${account} ${side} ${type} order just fine`, async () => {

          // preparing data
          const mockedParsedOrder = PARSED_ORDERS[0]

          const params: IAlunaOrderEditParams = {
            ...commonParams,
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
          authedRequest.returns(Promise.resolve(authedRequestResponse))

          const { parse } = mockParse({ module: parseImportPath })
          parse.returns({ order: mockedParsedOrder })


          const { validateParamsMock } = mockValidateParams()
          const { ensureOrderIsSupported } = mockEnsureOrderIsSupported()


          // executing
          const exchange = new ExchangeAuthed({ credentials })
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
            stub: authedRequest,
          })

        })

      })

    })

  })

}
