import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { HuobiOrderTypeEnum } from '../HuobiOrderTypeEnum'
import { HuobiOrderTypeAdapter } from './HuobiOrderTypeAdapter'



describe('HuobiOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Huobi order types to Aluna order types',
    () => {

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.STOP_LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.STOP_LIMIT)

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.IOC,
      })).to.be.eq(AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL)

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.LIMIT_FOK,
      })).to.be.eq(AlunaOrderTypesEnum.FILL_OF_KILL)

      expect(HuobiOrderTypeAdapter.translateToAluna({
        from: HuobiOrderTypeEnum.LIMIT_MAKER,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      let result
      let error

      try {

        result = HuobiOrderTypeAdapter.translateToAluna({
          from: notSupported as HuobiOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)

    })



  it('should properly translate Aluna order types to Huobi order types',
    () => {

      expect(HuobiOrderTypeAdapter.translateToHuobi({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(HuobiOrderTypeEnum.LIMIT)

      expect(HuobiOrderTypeAdapter.translateToHuobi({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(HuobiOrderTypeEnum.MARKET)

      expect(HuobiOrderTypeAdapter.translateToHuobi({
        from: AlunaOrderTypesEnum.STOP_LIMIT,
      })).to.be.eq(HuobiOrderTypeEnum.STOP_LIMIT)

      expect(HuobiOrderTypeAdapter.translateToHuobi({
        from: AlunaOrderTypesEnum.IMMEDIATE_OR_CANCEL,
      })).to.be.eq(HuobiOrderTypeEnum.IOC)

      expect(HuobiOrderTypeAdapter.translateToHuobi({
        from: AlunaOrderTypesEnum.FILL_OF_KILL,
      })).to.be.eq(HuobiOrderTypeEnum.LIMIT_FOK)

      let result
      let error

      try {

        result = HuobiOrderTypeAdapter.translateToHuobi({
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
