import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { SideEnum } from '../../../../lib/enums/SideEnum'
import { ValrSideEnum } from '../ValrSideEnum'
import { ValrSideAdapter } from './ValrSideAdapter'



describe('ValrSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Valr order sides to Aluna order sides', () => {

    expect(ValrSideAdapter.translateToAluna({
      from: ValrSideEnum.BUY,
    })).to.be.eq(SideEnum.LONG)

    expect(ValrSideAdapter.translateToAluna({
      from: ValrSideEnum.SELL,
    })).to.be.eq(SideEnum.SHORT)


    try {

      ValrSideAdapter.translateToAluna({
        from: notSupported as ValrSideEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    }


  })



  it('should properly translate Aluna order sides to Valr order sides', () => {

    expect(ValrSideAdapter.translateToValr({
      from: SideEnum.LONG,
    })).to.be.eq(ValrSideEnum.BUY)

    expect(ValrSideAdapter.translateToValr({
      from: SideEnum.SHORT,
    })).to.be.eq(ValrSideEnum.SELL)


    try {

      ValrSideAdapter.translateToValr({
        from: notSupported as SideEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.true
      expect(err.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    }

  })

})
