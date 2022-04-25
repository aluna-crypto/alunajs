import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { OkxOrderTypeEnum } from '../OkxOrderTypeEnum'
import { OkxOrderTypeAdapter } from './OkxOrderTypeAdapter'



describe('OkxOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Okx order types to Aluna order types',
    () => {

      expect(OkxOrderTypeAdapter.translateToAluna({
        from: OkxOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(OkxOrderTypeAdapter.translateToAluna({
        from: OkxOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      let result
      let error

      try {

        result = OkxOrderTypeAdapter.translateToAluna({
          from: notSupported as OkxOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)

    })



  it('should properly translate Aluna order types to Okx order types',
    () => {

      expect(OkxOrderTypeAdapter.translateToOkx({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(OkxOrderTypeEnum.LIMIT)

      expect(OkxOrderTypeAdapter.translateToOkx({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(OkxOrderTypeEnum.MARKET)

      let result
      let error

      try {

        result = OkxOrderTypeAdapter.translateToOkx({
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
