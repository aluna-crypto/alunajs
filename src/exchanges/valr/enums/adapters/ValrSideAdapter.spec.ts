import { expect } from 'chai'

import { SideEnum } from '../../../../lib/enums/SideEnum'
import { ValrError } from '../../ValrError'
import { ValrSideEnum } from '../ValrSideEnum'
import { ValrSideAdapter } from './ValrSideAdapter'



describe('ValrSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Valr order sides to Aluna order sides', () => {

    expect(ValrSideAdapter.translateToAluna({
      side: ValrSideEnum.BUY,
    })).to.be.eq(SideEnum.LONG)

    expect(ValrSideAdapter.translateToAluna({
      side: ValrSideEnum.SELL,
    })).to.be.eq(SideEnum.SHORT)


    try {

      ValrSideAdapter.translateToAluna({
        side: notSupported as ValrSideEnum,
      })

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    }


  })



  it('should properly translate Aluna order sides to Valr order sides', () => {

    expect(ValrSideAdapter.translateToValr({
      side: SideEnum.LONG,
    })).to.be.eq(ValrSideEnum.BUY)

    expect(ValrSideAdapter.translateToValr({
      side: SideEnum.SHORT,
    })).to.be.eq(ValrSideEnum.SELL)


    try {

      ValrSideAdapter.translateToValr({
        side: notSupported as SideEnum,
      })

    } catch (err) {

      expect(err instanceof ValrError).to.be.true
      expect(err.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    }

  })

})
