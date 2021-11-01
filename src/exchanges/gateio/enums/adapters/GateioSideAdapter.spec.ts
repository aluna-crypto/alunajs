// import { expect } from 'chai'

// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
// import { GateioSideEnum } from '../GateioSideEnum'
// import { GateioSideAdapter } from './GateioSideAdapter'



describe('GateioSideAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should properly translate Gateio order sides to Aluna order sides', () => {
    // TODO implement me

    // expect(GateioSideAdapter.translateToAluna({
    //   from: GateioSideEnum.BUY,
    // })).to.be.eq(AlunaSideEnum.LONG)

    // expect(GateioSideAdapter.translateToAluna({
    //   from: GateioSideEnum.SELL,
    // })).to.be.eq(AlunaSideEnum.SHORT)


    // try {

    //  GateioSideAdapter.translateToAluna({
    //    from: notSupported as GateioSideEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message)
    //    .to.be.eq(`Order side not supported: ${notSupported}`)

    // }


  })



  it.skip('should properly translate Aluna order sides to Gateio order sides', () => {
    // TODO implement me

    // expect(GateioSideAdapter.translateToGateio({
    //   from: AlunaSideEnum.LONG,
    // })).to.be.eq(GateioSideEnum.BUY)

    // expect(GateioSideAdapter.translateToGateio({
    //   from: AlunaSideEnum.SHORT,
    // })).to.be.eq(GateioSideEnum.SELL)


    // try {

    //  GateioSideAdapter.translateToGateio({
    //    from: notSupported as AlunaSideEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message)
    //    .to.be.eq(`Order side not supported: ${notSupported}`)

    // }

  })

})
