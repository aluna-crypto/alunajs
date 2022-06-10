import { expect } from 'chai'
import {
  cloneDeep,
  each,
} from 'lodash'
import { ImportMock } from 'ts-mock-imports'

import { AlunaInstrumentStateEnum } from '../../../../../../lib/enums/AlunaInstrumentStateEnum'
import { BitmexInstrumentStateEnum } from '../../../../enums/BitmexInstrumentStateEnum'
import { BITMEX_RAW_MARKETS } from '../../../../test/fixtures/bitmexMarket'
import * as computeContractCurrencyMod from './computeContractCurrency'
import * as computeContractValueMod from './computeContractValue'
import * as computeOrderValueMultiplierMod from './computeOrderValueMultiplier'
import { parseBitmexInstrument } from './parseBitmexInstrument'
import * as resolveSymbolsIdsMod from './resolveSymbolsIds'



describe(__filename, () => {

  it('should properly parse Bitmex instrument', () => {

    // preparing data
    const rawMarkets = cloneDeep(BITMEX_RAW_MARKETS)

    rawMarkets[0].isQuanto = true
    rawMarkets[0].expiry = '2016-05-13T12:00:00.000Z'
    rawMarkets[0].settle = '2016-05-13T12:00:00.000Z'

    rawMarkets[1].isQuanto = false
    rawMarkets[1].expiry = null
    rawMarkets[1].settle = null


    const mockedContractValue = 10
    const mockedContractCurrency = 'TORREs'
    const mockedOrderValueMultiplier = 0.9
    const mockedAmountSymbolId = 'ETH'
    const mockedRateSymbolId = 'XBT'
    const mockedTotalSymbolId = 'USD'


    // mocking
    const computeContractValueMock = ImportMock.mockFunction(
      computeContractValueMod,
      'computeContractValue',
      mockedContractValue,
    )

    const computeContractCurrencyMock = ImportMock.mockFunction(
      computeContractCurrencyMod,
      'computeContractCurrency',
      mockedContractCurrency,
    )

    const computeOrderValueMultiplierMock = ImportMock.mockFunction(
      computeOrderValueMultiplierMod,
      'computeOrderValueMultiplier',
      mockedOrderValueMultiplier,
    )

    const resolveSymbolsIdsMock = ImportMock.mockFunction(
      resolveSymbolsIdsMod,
      'resolveSymbolsIds',
      {
        rateSymbolId: mockedRateSymbolId,
        totalSymbolId: mockedTotalSymbolId,
        amountSymbolId: mockedAmountSymbolId,
      },
    )

    each(rawMarkets, (rawMarket) => {

      const {
        symbol,
        rootSymbol,
        expiry,
        settle,
        state,
        openingTimestamp,
        closingTimestamp,
        sessionInterval,
        listing,
        front,
        isQuanto,
        isInverse,
        lastPrice,
      } = rawMarket

      const expectedSplittedName = symbol.replace(
        new RegExp(`${rootSymbol}`),
        `${rootSymbol} `,
      )

      const expectedExpireDate = expiry
        ? new Date(expiry)
        : null

      const expectedSettleDate = settle
        ? new Date(settle)
        : null

      const expectedState = state === BitmexInstrumentStateEnum.OPEN
        ? AlunaInstrumentStateEnum.OPEN
        : AlunaInstrumentStateEnum.CLOSED

      const { instrument } = parseBitmexInstrument({ rawMarket })

      expect(instrument.name).to.be.eq(symbol)
      expect(instrument.splittedName).to.be.eq(expectedSplittedName)
      expect(instrument.state).to.be.eq(expectedState)
      expect(instrument.openDate).to.deep.eq(new Date(openingTimestamp))
      expect(instrument.closeDate).to.deep.eq(new Date(closingTimestamp))
      expect(instrument.sessionIntervalDate)
        .to.deep.eq(new Date(sessionInterval))
      expect(instrument.listingDate).to.deep.eq(new Date(listing))
      expect(instrument.frontDate).to.deep.eq(new Date(front))
      expect(instrument.expireDate).to.deep.eq(expectedExpireDate)
      expect(instrument.settleDate).to.deep.eq(expectedSettleDate)
      expect(instrument.price).to.be.eq(lastPrice)
      expect(instrument.isTradedByUnitsOfContract).to.be.eq(isQuanto)
      expect(instrument.isInverse).to.be.eq(isInverse)
      expect(instrument.amountSymbolId).to.be.eq(mockedAmountSymbolId)
      expect(instrument.rateSymbolId).to.be.eq(mockedRateSymbolId)
      expect(instrument.totalSymbolId).to.be.eq(mockedTotalSymbolId)
      expect(instrument.contractValue).to.be.eq(mockedContractValue)
      expect(instrument.contractCurrency).to.be.eq(mockedContractCurrency)
      expect(instrument.orderValueMultiplier)
        .to.be.eq(mockedOrderValueMultiplier)

    })

    const { length } = rawMarkets

    expect(computeContractValueMock.callCount).to.be.eq(length)
    expect(computeContractCurrencyMock.callCount).to.be.eq(length)
    expect(computeOrderValueMultiplierMock.callCount).to.be.eq(length)
    expect(resolveSymbolsIdsMock.callCount).to.be.eq(length)

  })

})
