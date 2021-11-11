// import { expect } from 'chai'

// import { AlunaError } from '../../../../lib/core/AlunaError'
// import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
// import { GateIOSideEnum } from '../GateIOSideEnum'
// import { GateIOSideAdapter } from './GateIOSideAdapter'



describe('GateIOSideAdapter', () => {

  const notSupported = 'not-supported'



  it.skip('should properly translate GateIO order sides to Aluna order sides', () => {
    // TODO implement me

    // expect(GateIOSideAdapter.translateToAluna({
    //   from: GateIOSideEnum.BUY,
    // })).to.be.eq(AlunaSideEnum.LONG)

    // expect(GateIOSideAdapter.translateToAluna({
    //   from: GateIOSideEnum.SELL,
    // })).to.be.eq(AlunaSideEnum.SHORT)


    // try {

    //  GateIOSideAdapter.translateToAluna({
    //    from: notSupported as GateIOSideEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message)
    //    .to.be.eq(`Order side not supported: ${notSupported}`)

    // }


  })



  it.skip('should properly translate Aluna order sides to GateIO order sides', () => {
    // TODO implement me

    // expect(GateIOSideAdapter.translateToGateIO({
    //   from: AlunaSideEnum.LONG,
    // })).to.be.eq(GateIOSideEnum.BUY)

    // expect(GateIOSideAdapter.translateToGateIO({
    //   from: AlunaSideEnum.SHORT,
    // })).to.be.eq(GateIOSideEnum.SELL)


    // try {

    //  GateIOSideAdapter.translateToGateIO({
    //    from: notSupported as AlunaSideEnum,
    //  })

    // } catch (err) {

    //  expect(err instanceof AlunaError).to.be.true
    //  expect(err.message)
    //    .to.be.eq(`Order side not supported: ${notSupported}`)

    // }

  })

})
