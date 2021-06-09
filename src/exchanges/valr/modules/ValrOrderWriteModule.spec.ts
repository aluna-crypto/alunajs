import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/abstracts/IAlunaExchange'
import { AccountEnum } from '../../../lib/enums/AccountEnum'
import { OrderTypesEnum } from '../../../lib/enums/OrderTypeEnum'
import { SideEnum } from '../../../lib/enums/SideEnum'
import { ValrOrderTimeInForceEnum } from '../enums/ValrOrderTimeInForceEnum'
import { ValrSideEnum } from '../enums/ValrSideEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrOrderWriteModule } from './ValrOrderWriteModule'



describe('ValrOrderWriteModule', () => {

  const valrOrderWriteModule = ValrOrderWriteModule.prototype



  it('should place a new Valr limit order just fine', async () => {

    const keySecret = {
      key: '',
      secret: '',
    }

    const placedOrderId = 'placed-order-id'

    const placedOrder = 'placed-order'

    ImportMock.mockOther(
      valrOrderWriteModule,
      'exchange',
      { keySecret } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
      { id: placedOrderId },
    )

    const getMock = ImportMock.mockFunction(
      valrOrderWriteModule,
      'get',
      placedOrder,
    )

    const params = {
      amount: '0.001',
      rate: '10000',
      symbolPair: 'ETHZAR',
      side: SideEnum.LONG,
      type: OrderTypesEnum.LIMIT,
      account: AccountEnum.EXCHANGE,
    }


    const placeResponse = await valrOrderWriteModule.place(params)


    expect(requestMock.calledOnce).to.be.true
    expect(requestMock.calledWith({
      url: 'https://api.valr.com/v1/orders/limit',
      body: {
        side: ValrSideEnum.BUY,
        pair: params.symbolPair,
        quantity: params.amount,
        price: params.rate,
        postOnly: false,
        timeInForce: ValrOrderTimeInForceEnum.GOOD_TILL_CANCELLED,
      },
      keySecret,
    })).to.be.true

    expect(getMock.calledOnce).to.be.true
    expect(getMock.calledWith({
      id: placedOrderId,
      symbolPair: params.symbolPair,
    })).to.be.true

    expect(placeResponse).to.deep.eq(getMock.returnValues[0])

  })

})
