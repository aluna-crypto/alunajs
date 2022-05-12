import BigNumber from 'bignumber.js'
import { expect } from 'chai'

import { IAlunaInstrumentSchema } from '../../../../../../lib/schemas/IAlunaInstrumentSchema'
import { computeOrderTotal } from './computeOrderTotal'



describe(__filename, () => {


  it("should properly compute order 'total' [INVERSE INSTRUMENT]", () => {

    // preparing data
    const orderQty = 10
    const computedPrice = 32000
    const computedAmount = 10

    const instrument = {
      isInverse: true,
      isTradedByUnitsOfContract: false,
      usdPricePerUnit: 20,
      price: 200,
    } as IAlunaInstrumentSchema


    // executing
    const { total } = computeOrderTotal({
      computedPrice,
      computedAmount,
      instrument,
      orderQty,
    })


    // validating
    const expectedTotal = orderQty

    expect(total).to.be.eq(expectedTotal)

  })

  it("should properly compute order 'total' [QUANTO INSTRUMENT]", () => {

    // preparing data
    const orderQty = 100
    const computedPrice = 200
    const computedAmount = 290

    const instrument = {
      isInverse: false,
      isTradedByUnitsOfContract: true,
      usdPricePerUnit: 10,
      price: 50,
    } as IAlunaInstrumentSchema


    // executing
    const { total } = computeOrderTotal({
      computedPrice,
      orderQty,
      computedAmount,
      instrument,
    })


    // validating
    const priceRatio = new BigNumber(computedPrice)
      .div(instrument.price)
      .toNumber()

    const pricePerContract = new BigNumber(priceRatio)
      .times(instrument.usdPricePerUnit!)
      .toNumber()

    const expectedTotal = new BigNumber(computedAmount)
      .times(pricePerContract)
      .toNumber()

    expect(total).to.be.eq(expectedTotal)

  })

  it(
    "should properly compute order 'total' [NOR QUANTO/INVERSE INSTRUMENT]",
    () => {

      // preparing data
      const orderQty = 200
      const computedPrice = 200
      const computedAmount = 290

      const instrument = {
        isInverse: false,
        isTradedByUnitsOfContract: false,
        usdPricePerUnit: 10,
        price: 50,
      } as IAlunaInstrumentSchema


      // executing
      const { total } = computeOrderTotal({
        computedPrice,
        computedAmount,
        instrument,
        orderQty,
      })


      // validating
      const expectedTotal = new BigNumber(computedAmount)
        .times(computedPrice)
        .toNumber()

      expect(total).to.be.eq(expectedTotal)

    },
  )

})
