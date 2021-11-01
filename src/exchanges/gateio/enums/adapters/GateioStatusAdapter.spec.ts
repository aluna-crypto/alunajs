// import { expect } from 'chai'
// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
// import { GateioOrderStatusEnum } from '../GateioOrderStatusEnum'
// import { GateioStatusAdapter } from './GateioStatusAdapter'



describe('GateioStatusAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should translate Gateio order status to Aluna order status', () => {
    // TODO: implement me

    // expect(GateioStatusAdapter.translateToAluna({
    //   from: GateioOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    // expect(GateioStatusAdapter.translateToAluna({
    //   from: GateioOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    // expect(GateioStatusAdapter.translateToAluna({
    //   from: GateioOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    // expect(GateioStatusAdapter.translateToAluna({
    //   from: GateioOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    // try {

    //   GateioStatusAdapter.translateToAluna({
    //     from: notSupported as GateioOrderStatusEnum,
    //   })

    // } catch (err) {

    //   expect(err instanceof AlunaError).to.be.true
    //   expect(err.message)
    //     .to.be.eq(`Order status not supported: ${notSupported}`)

    // }


  })



  it.skip('should translate Aluna order status to Gateio order status', () => {
    // TODO: implement me

    // expect(GateioStatusAdapter.translateToGateio({
    //   from: AlunaOrderStatusEnum.OPEN,
    // })).to.be.eq(GateioOrderStatusEnum)

    // expect(GateioStatusAdapter.translateToGateio({
    //   from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    // })).to.be.eq(GateioOrderStatusEnum)

    // expect(GateioStatusAdapter.translateToGateio({
    //   from: AlunaOrderStatusEnum.FILLED,
    // })).to.be.eq(GateioOrderStatusEnum)

    // expect(GateioStatusAdapter.translateToGateio({
    //   from: AlunaOrderStatusEnum.CANCELED,
    // })).to.be.eq(GateioOrderStatusEnum)


    // try {

    //   GateioStatusAdapter.translateToGateio({
    //     from: notSupported as AlunaOrderStatusEnum,
    //   })

    // } catch (err) {

    //   expect(err instanceof AlunaError).to.be.true
    //   expect(err.message)
    //     .to.be.eq(`Order status not supported: ${notSupported}`)

    // }

  })

})
