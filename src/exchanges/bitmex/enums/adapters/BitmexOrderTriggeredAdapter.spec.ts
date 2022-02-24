import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTriggeredStatusEnum } from '../../../../lib/enums/AlunaOrderTriggerStatusEnum'
import { BitmexOrderTriggeredStatus } from '../BitmexOrderTriggeredStatus'
import { BitmexOrderTriggeredAdapter } from './BitmexOrderTriggeredAdapter'



describe('BitmexOrderTriggeredAdapter', () => {

  const notSupported = 'not-supported'

  it('should properly translate Bitmex order triggered status to Aluna', () => {

    let error

    expect(BitmexOrderTriggeredAdapter.translateToAluna({
      from: BitmexOrderTriggeredStatus.TRIGGERED,
    })).to.be.eq(AlunaOrderTriggeredStatusEnum.TRIGGERED)

    expect(BitmexOrderTriggeredAdapter.translateToAluna({
      from: BitmexOrderTriggeredStatus.UNTRIGGERED,
    })).to.be.eq(AlunaOrderTriggeredStatusEnum.UNTRIGGERED)

    try {

      BitmexOrderTriggeredAdapter.translateToAluna({
        from: notSupported as BitmexOrderTriggeredStatus,
      })

    } catch (err) {

      error = err

    }

    expect(error).to.be.ok

    const { message } = error

    const msg = `Order triggered status not supported: ${notSupported}`

    expect(message).to.be.eq(msg)

  })

  it('should properly translate Aluna order type to Bitmex order type', () => {

    let error

    expect(BitmexOrderTriggeredAdapter.translateToBitmex({
      from: AlunaOrderTriggeredStatusEnum.TRIGGERED,
    })).to.be.eq(BitmexOrderTriggeredStatus.TRIGGERED)

    expect(BitmexOrderTriggeredAdapter.translateToBitmex({
      from: AlunaOrderTriggeredStatusEnum.UNTRIGGERED,
    })).to.be.eq(BitmexOrderTriggeredStatus.UNTRIGGERED)

    try {

      BitmexOrderTriggeredAdapter.translateToBitmex({
        from: notSupported as AlunaOrderTriggeredStatusEnum,
      })

    } catch (err) {

      error = err

    }

    expect(error instanceof AlunaError).to.be.ok

    const msg = `Order triggered status not supported: ${notSupported}`

    expect(error.message)
      .to.be.eq(msg)

  })

})
