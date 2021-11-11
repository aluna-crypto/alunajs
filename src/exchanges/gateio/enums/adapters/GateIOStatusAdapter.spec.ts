// import { expect } from 'chai'
// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaOrderStatusEnum } from '../../../../lib/enums/AlunaOrderStatusEnum'
// import { GateIOOrderStatusEnum } from '../GateIOOrderStatusEnum'
// import { GateIOStatusAdapter } from './GateIOStatusAdapter'



describe('GateIOStatusAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should translate GateIO order status to Aluna order status', () => {
    // TODO: implement me

    // expect(GateIOStatusAdapter.translateToAluna({
    //   from: GateIOOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.OPEN)

    // expect(GateIOStatusAdapter.translateToAluna({
    //   from: GateIOOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.PARTIALLY_FILLED)

    // expect(GateIOStatusAdapter.translateToAluna({
    //   from: GateIOOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.FILLED)

    // expect(GateIOStatusAdapter.translateToAluna({
    //   from: GateIOOrderStatusEnum,
    // })).to.be.eq(AlunaOrderStatusEnum.CANCELED)

    // try {

    //   GateIOStatusAdapter.translateToAluna({
    //     from: notSupported as GateIOOrderStatusEnum,
    //   })

    // } catch (err) {

    //   expect(err instanceof AlunaError).to.be.true
    //   expect(err.message)
    //     .to.be.eq(`Order status not supported: ${notSupported}`)

    // }


  })



  it.skip('should translate Aluna order status to GateIO order status', () => {
    // TODO: implement me

    // expect(GateIOStatusAdapter.translateToGateIO({
    //   from: AlunaOrderStatusEnum.OPEN,
    // })).to.be.eq(GateIOOrderStatusEnum)

    // expect(GateIOStatusAdapter.translateToGateIO({
    //   from: AlunaOrderStatusEnum.PARTIALLY_FILLED,
    // })).to.be.eq(GateIOOrderStatusEnum)

    // expect(GateIOStatusAdapter.translateToGateIO({
    //   from: AlunaOrderStatusEnum.FILLED,
    // })).to.be.eq(GateIOOrderStatusEnum)

    // expect(GateIOStatusAdapter.translateToGateIO({
    //   from: AlunaOrderStatusEnum.CANCELED,
    // })).to.be.eq(GateIOOrderStatusEnum)


    // try {

    //   GateIOStatusAdapter.translateToGateIO({
    //     from: notSupported as AlunaOrderStatusEnum,
    //   })

    // } catch (err) {

    //   expect(err instanceof AlunaError).to.be.true
    //   expect(err.message)
    //     .to.be.eq(`Order status not supported: ${notSupported}`)

    // }

  })

})
