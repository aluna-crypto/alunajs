// import { expect } from 'chai'

// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
// import { GateIOOrderTypesEnum } from '../GateIOOrderTypesEnum'
// import { GateIOOrderTypeAdapter } from './GateIOOrderTypeAdapter'



describe('GateIOOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should properly translate GateIO order types to Aluna order types', () => {
    // TODO implement me

    // expect(GateIOOrderTypeAdapter.translateToAluna({
    //   from: GateIOOrderTypesEnum.LIMIT,
    // })).to.be.eq(AlunaOrderTypesEnum.LIMIT)


    // expect(GateIOOrderTypeAdapter.translateToAluna({
    //   from: GateIOOrderTypesEnum.MARKET,
    // })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    // try {

    //  GateIOOrderTypeAdapter.translateToAluna({
    //    from: notSupported as GateIOOrderTypesEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    // }


  })



  it.skip('should properly translate Aluna order types to GateIO order types', () => {
    // TODO implement me

    // expect(GateIOOrderTypeAdapter.translateToGateIO({
    //   from: AlunaOrderTypesEnum.LIMIT,
    // })).to.be.eq(GateIOOrderTypesEnum.LIMIT)

    // expect(GateIOOrderTypeAdapter.translateToGateIO({
    //   from: AlunaOrderTypesEnum.MARKET,
    // })).to.be.eq(GateIOOrderTypesEnum.MARKET)


    // try {

    //   GateIOOrderTypeAdapter.translateToGateIO({
    //     from: notSupported as AlunaOrderTypesEnum,
    //   })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    // }

  })

})
