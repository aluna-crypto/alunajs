import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaPositionSideEnum } from '../../../../lib/enums/AlunaPositionSideEnum'
import { OkxPositionSideEnum } from '../OkxPositionSideEnum'
import { OkxPositionSideAdapter } from './OkxPositionSideAdapter'



describe('OkxPositionSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Okx position sides to Aluna position sides',
    () => {

      expect(OkxPositionSideAdapter.translateToAluna({
        from: OkxPositionSideEnum.LONG,
      })).to.be.eq(AlunaPositionSideEnum.LONG)

      expect(OkxPositionSideAdapter.translateToAluna({
        from: OkxPositionSideEnum.SHORT,
      })).to.be.eq(AlunaPositionSideEnum.SHORT)

      let result
      let error

      try {

        result = OkxPositionSideAdapter.translateToAluna({
          from: notSupported as OkxPositionSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Position side not supported: ${notSupported}`)


    })



  it('should properly translate Aluna position sides to Okx position sides',
    () => {

      expect(OkxPositionSideAdapter.translateToOkx({
        from: AlunaPositionSideEnum.LONG,
      })).to.be.eq(OkxPositionSideEnum.LONG)

      expect(OkxPositionSideAdapter.translateToOkx({
        from: AlunaPositionSideEnum.SHORT,
      })).to.be.eq(OkxPositionSideEnum.SHORT)

      let result
      let error

      try {

        result = OkxPositionSideAdapter.translateToOkx({
          from: notSupported as AlunaPositionSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Position side not supported: ${notSupported}`)

    })

})
