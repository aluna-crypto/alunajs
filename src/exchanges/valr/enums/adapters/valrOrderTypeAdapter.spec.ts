import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { ValrOrderTypeEnum } from '../ValrOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToValr,
} from './valrOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Valr order types to Aluna order types',
    () => {

      expect(translateOrderTypeToAluna({
        from: ValrOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(translateOrderTypeToAluna({
        from: ValrOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      expect(translateOrderTypeToAluna({
        from: ValrOrderTypeEnum.CEILING_LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

      expect(translateOrderTypeToAluna({
        from: ValrOrderTypeEnum.CEILING_MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

      let result
      let error

      try {

        result = translateOrderTypeToAluna({
          from: notSupported as ValrOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order types to Valr order types',
    () => {

      expect(translateOrderTypeToValr({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(ValrOrderTypeEnum.LIMIT)

      expect(translateOrderTypeToValr({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(ValrOrderTypeEnum.MARKET)

      expect(translateOrderTypeToValr({
        from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
      })).to.be.eq(ValrOrderTypeEnum.CEILING_LIMIT)

      expect(translateOrderTypeToValr({
        from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
      })).to.be.eq(ValrOrderTypeEnum.CEILING_MARKET)

      let result
      let error

      try {

        translateOrderTypeToValr({
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
