import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { translateAmountToOrderQty } from './translateAmountToOrderQty'



describe(__filename, () => {


  it(
    "should properly translate amount to 'orderQty' [INVERSE INSTRUMENT]",
    () => {

      // preparing data
      const amount = 300

      const instrument = {
        isInverse: true,
        contractValue: 10,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema


      // executing
      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })


      // validating
      const expectedOrderQty = amount

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

  it(
    "should properly translate amount to 'orderQty' [QUANTO INSTRUMENT]",
    () => {

      // preparing data
      const amount = 0.04

      const instrument = {
        isInverse: false,
        contractValue: 10,
        isTradedByUnitsOfContract: true,
      } as IAlunaInstrumentSchema


      // executing
      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })


      // validating
      const expectedOrderQty = amount

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

  it(
    "should translate amount to 'orderQty' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      // preparing data
      const amount = 0.04

      const instrument = {
        isInverse: false,
        contractValue: 10,
        isTradedByUnitsOfContract: false,
      } as IAlunaInstrumentSchema



      // executing
      const orderQty = translateAmountToOrderQty({
        amount,
        instrument,
      })


      // validating
      const expectedOrderQty = new BigNumber(amount)
        .div(instrument.contractValue)
        .toNumber()

      expect(orderQty).to.be.eq(expectedOrderQty)

    },
  )

})
