import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaSideEnum } from '../../../../lib/enums/AlunaSideEnum'
import { FtxSideEnum } from '../FtxSideEnum'
import { FtxSideAdapter } from './FtxSideAdapter'



describe('FtxSideAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Ftx order sides to Aluna order sides',
    () => {

      expect(FtxSideAdapter.translateToAluna({
        from: FtxSideEnum.BUY,
      })).to.be.eq(AlunaSideEnum.LONG)

      expect(FtxSideAdapter.translateToAluna({
        from: FtxSideEnum.SELL,
      })).to.be.eq(AlunaSideEnum.SHORT)

      let result
      let error

      try {

        result = FtxSideAdapter.translateToAluna({
          from: notSupported as FtxSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order sides to Ftx order sides',
    () => {

      expect(FtxSideAdapter.translateToFtx({
        from: AlunaSideEnum.LONG,
      })).to.be.eq(FtxSideEnum.BUY)

      expect(FtxSideAdapter.translateToFtx({
        from: AlunaSideEnum.SHORT,
      })).to.be.eq(FtxSideEnum.SELL)

      let result
      let error

      try {

        result = FtxSideAdapter.translateToFtx({
          from: notSupported as AlunaSideEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order side not supported: ${notSupported}`)

    })

})
