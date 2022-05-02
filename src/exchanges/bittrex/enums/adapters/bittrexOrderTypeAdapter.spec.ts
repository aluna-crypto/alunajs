import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BittrexOrderTypeEnum } from '../BittrexOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToBittrex,
} from './bittrexOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Bittrex order types to Aluna order types',
    () => {

      expect(translateOrderTypeToAluna({
        from: BittrexOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(translateOrderTypeToAluna({
        from: BittrexOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      expect(translateOrderTypeToAluna({
        from: BittrexOrderTypeEnum.CEILING_LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

      expect(translateOrderTypeToAluna({
        from: BittrexOrderTypeEnum.CEILING_MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

      let result
      let error

      try {

        result = translateOrderTypeToAluna({
          from: notSupported as BittrexOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order types to Bittrex order types',
    () => {

      expect(translateOrderTypeToBittrex({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(BittrexOrderTypeEnum.LIMIT)

      expect(translateOrderTypeToBittrex({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(BittrexOrderTypeEnum.MARKET)

      expect(translateOrderTypeToBittrex({
        from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
      })).to.be.eq(BittrexOrderTypeEnum.CEILING_LIMIT)

      expect(translateOrderTypeToBittrex({
        from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
      })).to.be.eq(BittrexOrderTypeEnum.CEILING_MARKET)

      let result
      let error

      try {

        translateOrderTypeToBittrex({
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
