import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BitfinexOrderTypeEnum } from '../BitfinexOrderTypeEnum'
import {
  translateOrderTypeToAluna,
  translateOrderTypeToBitfinex,
} from './bitfinexOrderTypeAdapter'



describe(__filename, () => {

  const notSupported = 'not-supported'



  it('should properly translate Bitfinex order types to Aluna order types',
    () => {

      expect(translateOrderTypeToAluna({
        from: BitfinexOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(translateOrderTypeToAluna({
        from: BitfinexOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      expect(translateOrderTypeToAluna({
        from: BitfinexOrderTypeEnum.CEILING_LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

      expect(translateOrderTypeToAluna({
        from: BitfinexOrderTypeEnum.CEILING_MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)

      let result
      let error

      try {

        result = translateOrderTypeToAluna({
          from: notSupported as BitfinexOrderTypeEnum,
        })

      } catch (err) {

        error = err

      }

      expect(result).not.to.be.ok

      expect(error instanceof AlunaError).to.be.ok
      expect(error.message)
        .to.be.eq(`Order type not supported: ${notSupported}`)


    })



  it('should properly translate Aluna order types to Bitfinex order types',
    () => {

      expect(translateOrderTypeToBitfinex({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(BitfinexOrderTypeEnum.LIMIT)

      expect(translateOrderTypeToBitfinex({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(BitfinexOrderTypeEnum.MARKET)

      expect(translateOrderTypeToBitfinex({
        from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
      })).to.be.eq(BitfinexOrderTypeEnum.CEILING_LIMIT)

      expect(translateOrderTypeToBitfinex({
        from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
      })).to.be.eq(BitfinexOrderTypeEnum.CEILING_MARKET)

      let result
      let error

      try {

        translateOrderTypeToBitfinex({
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
