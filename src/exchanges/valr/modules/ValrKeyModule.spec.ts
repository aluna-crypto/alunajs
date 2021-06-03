import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { IAlunaExchange } from '../../../lib/abstracts/IAlunaExchange'
import { ValrErrorEnum } from '../enums/ValrErrorEnum'
import { ValrHttp } from '../ValrHttp'
import { ValrKeyModule } from './ValrKeyModule'



describe('ValrKeyModule', () => {


  beforeEach(() => {

    ImportMock.restore()

  })



  it('should try to validate user API key', async () => {

    const getPermissionsMock = ImportMock.mockFunction(
      ValrKeyModule.prototype,
      'getPermissions',
    )

    getPermissionsMock
      .onFirstCall()
      .returns({ read: false })
      .onSecondCall()
      .returns({ read: true })


    const invalidKey = await ValrKeyModule.prototype.validate()

    expect(getPermissionsMock.calledOnce).to.be.true
    expect(invalidKey).to.be.false


    const validKey = await ValrKeyModule.prototype.validate()


    expect(getPermissionsMock.calledTwice).to.be.true
    expect(validKey).to.be.true

  })


  it('should try to get permissions from Valr API key', async () => {

    ImportMock.mockOther(
      ValrKeyModule.prototype,
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


    const permissions1 = await ValrKeyModule.prototype.getPermissions()

    expect(permissions1.read).to.be.false
    expect(permissions1.trade).to.be.false
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


    const permissions2 = await ValrKeyModule.prototype.getPermissions()


    expect(permissions2.read).to.be.true
    expect(permissions2.trade).to.be.false
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


    const permissions3 = await ValrKeyModule.prototype.getPermissions()


    expect(permissions3.read).to.be.true
    expect(permissions3.trade).to.be.true
    expect(permissions3.withdraw).to.be.undefined

  })



  it('should ensure permissions are parsed just fine', async () => {

    const key1 = {
      read: false,
      trade: false,
      withdraw: undefined,
    }

    const perm1 = ValrKeyModule.prototype.parsePermissions({
      rawKey: key1,
    })


    expect(key1).to.deep.eq(perm1)


    const key2 = {
      read: true,
      trade: false,
      withdraw: undefined,
    }

    const perm2 = ValrKeyModule.prototype.parsePermissions({
      rawKey: key2,
    })


    expect(key2).to.deep.eq(perm2)


    const key3 = {
      read: true,
      trade: true,
      withdraw: undefined,
    }

    const perm3 = ValrKeyModule.prototype.parsePermissions({
      rawKey: key3,
    })


    expect(key3).to.deep.eq(perm3)

  })

})
