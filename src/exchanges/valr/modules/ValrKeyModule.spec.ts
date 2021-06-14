import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/core/IAlunaExchange'
import { ValrErrorEnum } from '../enums/ValrErrorEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrKeyModule } from './ValrKeyModule'



describe('ValrKeyModule', () => {

  const valrKeyModule = ValrKeyModule.prototype



  it('should try to validate user API key', async () => {


    const getPermissionsMock = ImportMock.mockFunction(
      valrKeyModule,
      'getPermissions',
    )

    getPermissionsMock
      .onFirstCall()
      .returns({ read: false })
      .onSecondCall()
      .returns({ read: true })


    const invalidKey = await valrKeyModule.validate()

    expect(getPermissionsMock.callCount).to.be.eq(1)
    expect(invalidKey).not.to.be.ok


    const validKey = await valrKeyModule.validate()


    expect(getPermissionsMock.callCount).to.be.eq(2)
    expect(validKey).to.be.ok

  })


  it('should try to get permissions from Valr API key', async () => {

    ImportMock.mockOther(
      valrKeyModule,
      'exchange',
      {
        keySecret: {
          key: '',
          secret: '',
        },
      } as IAlunaExchange,
    )

    const requestMock = ImportMock.mockFunction(
      ValrHttp,
      'privateRequest',
    )

    requestMock
      .onCall(0)
      /**
       * Rejecting at the first call means it fails fetching open orders.
       * This means that the API key cannot read. API key no permission to read
       * or Invalid.
       */
      .rejects({ message: ValrErrorEnum.UNAUTHORIZED })


    const permissions1 = await valrKeyModule.getPermissions()

    expect(permissions1.read).not.to.be.ok
    expect(permissions1.trade).not.to.be.ok
    expect(permissions1.withdraw).to.be.undefined


    requestMock
      .onCall(1)
      /**
       * Resolves when trying to fetch open orders, it means the API key has
       * permission to read.
       */
      .resolves()
      .onCall(2)
      /**
       * Then rejects with UNAUTHORIZED message when trying to place an order.
       * It means the API key has no permission to trade.
       */
      .rejects({ message: ValrErrorEnum.UNAUTHORIZED })


    const permissions2 = await valrKeyModule.getPermissions()


    expect(permissions2.read).to.be.ok
    expect(permissions2.trade).not.to.be.ok
    expect(permissions2.withdraw).to.be.undefined



    requestMock
      .onCall(3)
      .resolves()
      .onCall(4)
      /**
       * Rejecting with INVALID_REQUEST when trying to place an order means
       * that Valr server already ensured the API key has permission to place
       * orders/trade. It throws with an invalid request message because the
       * place order params are invalid
       */
      .rejects({ message: ValrErrorEnum.INVALID_REQUEST })


    const permissions3 = await valrKeyModule.getPermissions()


    expect(permissions3.read).to.be.ok
    expect(permissions3.trade).to.be.ok
    expect(permissions3.withdraw).to.be.undefined

  })



  it('should ensure permissions are parsed just fine', async () => {

    const key1 = {
      read: false,
      trade: false,
      withdraw: undefined,
    }

    const perm1 = valrKeyModule.parsePermissions({
      rawKey: key1,
    })


    expect(key1).to.deep.eq(perm1)


    const key2 = {
      read: true,
      trade: false,
      withdraw: undefined,
    }

    const perm2 = valrKeyModule.parsePermissions({
      rawKey: key2,
    })


    expect(key2).to.deep.eq(perm2)


    const key3 = {
      read: true,
      trade: true,
      withdraw: undefined,
    }

    const perm3 = valrKeyModule.parsePermissions({
      rawKey: key3,
    })


    expect(key3).to.deep.eq(perm3)

  })

})
