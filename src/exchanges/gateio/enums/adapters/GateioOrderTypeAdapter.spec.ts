// import { expect } from 'chai'

// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
// import { GateioOrderTypesEnum } from '../GateioOrderTypesEnum'
// import { GateioOrderTypeAdapter } from './GateioOrderTypeAdapter'



describe('GateioOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should properly translate Gateio order types to Aluna order types', () => {
    // TODO implement me

    // expect(GateioOrderTypeAdapter.translateToAluna({
    //   from: GateioOrderTypesEnum.LIMIT,
    // })).to.be.eq(AlunaOrderTypesEnum.LIMIT)


    // expect(GateioOrderTypeAdapter.translateToAluna({
    //   from: GateioOrderTypesEnum.MARKET,
    // })).to.be.eq(AlunaOrderTypesEnum.MARKET)

    // try {

    //  GateioOrderTypeAdapter.translateToAluna({
    //    from: notSupported as GateioOrderTypesEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    // }


  })



  it.skip('should properly translate Aluna order types to Gateio order types', () => {
    // TODO implement me

    // expect(GateioOrderTypeAdapter.translateToGateio({
    //   from: AlunaOrderTypesEnum.LIMIT,
    // })).to.be.eq(GateioOrderTypesEnum.LIMIT)

    // expect(GateioOrderTypeAdapter.translateToGateio({
    //   from: AlunaOrderTypesEnum.MARKET,
    // })).to.be.eq(GateioOrderTypesEnum.MARKET)


    // try {

    //   GateioOrderTypeAdapter.translateToGateio({
    //     from: notSupported as AlunaOrderTypesEnum,
    //   })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message).to.be.eq(`Order type not supported: ${notSupported}`)

    // }

  })

})
