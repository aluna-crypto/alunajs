import { expect } from 'chai'

import { AlunaError } from '../../../../lib/core/AlunaError'
import { AlunaOrderTypesEnum } from '../../../../lib/enums/AlunaOrderTypesEnum'
import { BittrexOrderTypeEnum } from '../BittrexOrderTypeEnum'
import { BittrexOrderTypeAdapter } from './BittrexOrderTypeAdapter'



describe('BittrexOrderTypeAdapter', () => {

  const notSupported = 'not-supported'



  it('should properly translate Bittrex order types to Aluna order types',
    () => {

      expect(BittrexOrderTypeAdapter.translateToAluna({
        from: BittrexOrderTypeEnum.LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT)

      expect(BittrexOrderTypeAdapter.translateToAluna({
        from: BittrexOrderTypeEnum.MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.MARKET)

      expect(BittrexOrderTypeAdapter.translateToAluna({
        from: BittrexOrderTypeEnum.CEILING_LIMIT,
      })).to.be.eq(AlunaOrderTypesEnum.LIMIT_ORDER_BOOK)

      expect(BittrexOrderTypeAdapter.translateToAluna({
        from: BittrexOrderTypeEnum.CEILING_MARKET,
      })).to.be.eq(AlunaOrderTypesEnum.TAKE_PROFIT_MARKET)


      try {

        BittrexOrderTypeAdapter.translateToAluna({
          from: notSupported as BittrexOrderTypeEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order type not supported: ${notSupported}`)

      }


    })



  it('should properly translate Aluna order types to Bittrex order types',
    () => {

      expect(BittrexOrderTypeAdapter.translateToBittrex({
        from: AlunaOrderTypesEnum.LIMIT,
      })).to.be.eq(BittrexOrderTypeEnum.LIMIT)

      expect(BittrexOrderTypeAdapter.translateToBittrex({
        from: AlunaOrderTypesEnum.MARKET,
      })).to.be.eq(BittrexOrderTypeEnum.MARKET)

      expect(BittrexOrderTypeAdapter.translateToBittrex({
        from: AlunaOrderTypesEnum.LIMIT_ORDER_BOOK,
      })).to.be.eq(BittrexOrderTypeEnum.CEILING_LIMIT)

      expect(BittrexOrderTypeAdapter.translateToBittrex({
        from: AlunaOrderTypesEnum.TAKE_PROFIT_MARKET,
      })).to.be.eq(BittrexOrderTypeEnum.CEILING_MARKET)


      try {

        BittrexOrderTypeAdapter.translateToBittrex({
          from: notSupported as AlunaOrderTypesEnum,
        })

      } catch (err) {

        expect(err instanceof AlunaError).to.be.ok
        expect(err.message)
          .to.be.eq(`Order type not supported: ${notSupported}`)

      }

    })

})
