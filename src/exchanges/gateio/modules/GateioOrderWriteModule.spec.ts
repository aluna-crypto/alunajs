import { expect } from 'chai'
import { ImportMock } from 'ts-mock-imports'

import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaAccountEnum } from '../../../lib/enums/AlunaAccountEnum'
import { AlunaFeaturesModeEnum } from '../../../lib/enums/AlunaFeaturesModeEnum'
import { AlunaOrderTypesEnum } from '../../../lib/enums/AlunaOrderTypesEnum'
import { IAlunaOrderPlaceParams } from '../../../lib/modules/IAlunaOrderModule'
import { IAlunaExchangeOrderOptionsSchema } from '../../../lib/schemas/IAlunaExchangeSpecsSchema'
import { GateioSpecs } from '../GateioSpecs'
import { GateioOrderWriteModule } from './GateioOrderWriteModule'



describe('GateioOrderWriteModule', () => {

  const gateioOrderWriteModule = GateioOrderWriteModule.prototype



  it.skip('should place a new Gateio limit order just fine', async () => {

    // TODO implement me

  })



  it.skip('should place a new Gateio market order just fine', async () => {

    // TODO implement me

  })



  it.skip('should ensure given account is one of AlunaAccountEnum', async () => {

    ImportMock.mockOther(
      GateioSpecs,
      'accounts',
      {},
    )

    const account = 'nonexistent'

    try {

      await gateioOrderWriteModule.place({
        account,
      } as unknown as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Account type '${account}' is not in Gateio specs`,
      )

    }

  })



  it.skip('should ensure given account is supported', async () => {

    ImportMock.mockOther(
      GateioSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: false,
          implemented: true,
        },
      },
    )

    const account = AlunaAccountEnum.EXCHANGE

    try {

      await gateioOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Account type '${account}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure given account is implemented', async () => {

    ImportMock.mockOther(
      GateioSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: true,
          implemented: false,
        },
      },
    )

    const account = AlunaAccountEnum.EXCHANGE

    try {

      await gateioOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Account type '${account}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure given account has orderTypes property', async () => {

    ImportMock.mockOther(
      GateioSpecs,
      'accounts',
      {
        [AlunaAccountEnum.EXCHANGE]: {
          supported: true,
          implemented: true,
          // missing orderTypes property
        },
      },
    )

    const account = AlunaAccountEnum.EXCHANGE

    try {

      await gateioOrderWriteModule.place({
        account,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Account type '${account}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure account orderTypes has given order type', async () => {

    ImportMock.mockOther(
      GateioSpecs.accounts.exchange,
      'orderTypes',
      {
        [AlunaOrderTypesEnum.LIMIT]: {
          supported: true,
          implemented: true,
          mode: AlunaFeaturesModeEnum.WRITE,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    const type = 'unsupported-type'

    try {

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type: type as AlunaOrderTypesEnum,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Order type '${type}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure given order type is supported', async () => {

    ImportMock.mockOther(
      GateioSpecs.accounts.exchange,
      'orderTypes',
      {
        [AlunaOrderTypesEnum.LIMIT]: {
          supported: false,
          implemented: true,
          mode: AlunaFeaturesModeEnum.READ,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    const type = AlunaOrderTypesEnum.LIMIT

    try {

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Order type '${type}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure given order type is implemented', async () => {

    ImportMock.mockOther(
      GateioSpecs.accounts.exchange,
      'orderTypes',
      {
        [AlunaOrderTypesEnum.LIMIT]: {
          supported: false,
          implemented: true,
          mode: AlunaFeaturesModeEnum.READ,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    const type = AlunaOrderTypesEnum.LIMIT

    try {

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Order type '${type}' not supported/implemented for Varl`,
      )

    }

  })



  it.skip('should ensure given order type has write mode', async () => {

    ImportMock.mockOther(
      GateioSpecs.accounts.exchange,
      'orderTypes',
      {
        [AlunaOrderTypesEnum.LIMIT]: {
          supported: true,
          implemented: true,
          mode: AlunaFeaturesModeEnum.READ,
          options: {} as IAlunaExchangeOrderOptionsSchema,
        },
      },
    )

    const type = AlunaOrderTypesEnum.LIMIT

    try {

      await gateioOrderWriteModule.place({
        account: AlunaAccountEnum.EXCHANGE,
        type,
      } as IAlunaOrderPlaceParams)

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message).to.be.eq(
        `Order type '${type}' is in read mode`,
      )

    }

  })



  it.skip('should ensure an order was canceled', async () => {

    // TODO implement me

  })



  it.skip('should cancel an open order just fine', async () => {

    // TODO implement me

  })

})
