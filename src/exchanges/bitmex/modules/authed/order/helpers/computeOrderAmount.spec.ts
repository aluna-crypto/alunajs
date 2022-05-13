import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { computeOrderAmount } from './computeOrderAmount'



describe(__filename, () => {

  it("should properly compute order 'amount' [INVERSE INSTRUMENT]", () => {

    // preparing data
    const orderQty = 100

    const computedPrice = 32000

    const instrument = {
      isInverse: true,
      isTradedByUnitsOfContract: false,
      contractValue: 0.0898,
    } as IAlunaInstrumentSchema


    // executing
    const { amount } = computeOrderAmount({
      computedPrice,
      instrument,
      orderQty,
    })


    // validating
    const expectedAmount = new BigNumber(orderQty)
      .div(computedPrice)
      .toNumber()

    expect(amount).to.be.eq(expectedAmount)

  })

  it("should properly compute order 'amount' [QUANTO INSTRUMENT]", () => {

    // preparing data
    const orderQty = 5

    const computedPrice = 32000

    const instrument = {
      isInverse: false,
      isTradedByUnitsOfContract: true,
      contractValue: 0.0898,
    } as IAlunaInstrumentSchema


    // executing
    const { amount } = computeOrderAmount({
      computedPrice,
      instrument,
      orderQty,
    })


    // validating
    const expectedAmount = orderQty

    expect(amount).to.be.eq(expectedAmount)

  })

  it(
    "should properly compute order 'amount' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      // preparing data
      const orderQty = 0.05

      const computedPrice = 32000

      const instrument = {
        isInverse: false,
        isTradedByUnitsOfContract: false,
        contractValue: 0.0898,
      } as IAlunaInstrumentSchema


      // executing
      const { amount } = computeOrderAmount({
        computedPrice,
        instrument,
        orderQty,
      })


      // validating
      const expectedAmount = new BigNumber(orderQty)
        .times(instrument.contractValue)
        .toNumber()

      expect(amount).to.be.eq(expectedAmount)

    },
  )

})
