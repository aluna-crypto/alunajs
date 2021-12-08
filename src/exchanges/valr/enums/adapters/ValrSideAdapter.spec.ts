import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { ValrSideEnum } from '../ValrSideEnum'
import { ValrSideAdapter } from './ValrSideAdapter'



describe('ValrSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Valr order sides to Aluna order sides', () => {

    expect(ValrSideAdapter.translateToAluna({
      from: ValrSideEnum.BUY,
    })).to.be.eq(AlunaSideEnum.LONG)

    expect(ValrSideAdapter.translateToAluna({
      from: ValrSideEnum.SELL,
    })).to.be.eq(AlunaSideEnum.SHORT)


    try {

      ValrSideAdapter.translateToAluna({
        from: notSupported as ValrSideEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { data: { error } } = err as AlunaError
      expect(error).to.be.eq(`Order side not supported: ${notSupported}`)

    }


  })



  it('should properly translate Aluna order sides to Valr order sides', () => {

    expect(ValrSideAdapter.translateToValr({
      from: AlunaSideEnum.LONG,
    })).to.be.eq(ValrSideEnum.BUY)

    expect(ValrSideAdapter.translateToValr({
      from: AlunaSideEnum.SHORT,
    })).to.be.eq(ValrSideEnum.SELL)


    try {

      ValrSideAdapter.translateToValr({
        from: notSupported as AlunaSideEnum,
      })

    } catch (err) {

      expect(err instanceof AlunaError).to.be.ok

      const { data: { error } } = err as AlunaError
      expect(error).to.be.eq(`Order side not supported: ${notSupported}`)

    }

  })

})
