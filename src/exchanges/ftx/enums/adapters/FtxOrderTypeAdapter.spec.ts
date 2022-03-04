import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { FtxOrderTypeEnum } from '../FtxOrderTypeEnum'
import { FtxOrderTypeAdapter } from './FtxOrderTypeAdapter'



describe('FtxOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Ftx order types to Aluna order types',
    () => {

      expect(FtxOrderTypeAdapter.translateToAluna({
        from: FtxOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(FtxOrderTypeAdapter.translateToAluna({
        from: FtxOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)


      let result
      let error

      try {

        result = FtxOrderTypeAdapter.translateToAluna({
          from: notSupported as FtxOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)

    })



  it('should properly translate Aluna order types to Ftx order types',
    () => {

      expect(FtxOrderTypeAdapter.translateToFtx({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(FtxOrderTypeEnum.LIMIT)

      expect(FtxOrderTypeAdapter.translateToFtx({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(FtxOrderTypeEnum.MARKET)

      let result
      let error

      try {

        result = FtxOrderTypeAdapter.translateToFtx({
          from: notSupported as AlunaOrderTypesEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)

    })

})
