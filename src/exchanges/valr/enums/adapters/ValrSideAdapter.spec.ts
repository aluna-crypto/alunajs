import { expect } from 'chai'

import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { ValrSideEnum } from '../ValrSideEnum'
import { ValrSideAdapter } from './ValrSideAdapter'



describe('ValrSideAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Valr order sides to Aluna order sides', () => {

    let error

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

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order side not supported: ${notSupported}`)

  })

  it('should properly translate Aluna order sides to Valr order sides', () => {

    let error

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

      error = err

    }

    expect(error).to.be.ok

    const { message } = error
    expect(message).to.be.eq(`Order side not supported: ${notSupported}`)

  })

})
