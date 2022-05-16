import { expect } from 'chai'
import { each } from 'lodash'

import { AlunaAccountEnum } from '../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderSideEnum } from '../../../../src/lib/enums/AlunaOrderSideEnum'
import { IAuthedParams } from '../IAuthedParams'
import { isGetTradableBalanceImplemented } from './helpers/utils/isGetTradableBalanceImplemented'



export function balance(params: IAuthedParams) {

  const {
    exchangeAuthed,
    exchangeConfigs,
  } = params

  it('listRaw', async () => {

    const {
      rawBalances,
      requestWeight,
    } = await exchangeAuthed.balance.listRaw()

    expect(rawBalances).to.exist

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

  it('list', async () => {

    const {
      balances,
      requestWeight,
    } = await exchangeAuthed.balance.list()

    expect(balances).to.exist

    expect(balances.length).to.be.greaterThan(0)

    each(balances, (balance) => {

      expect(balance.available).to.exist
      expect(balance.symbolId).to.exist
      expect(balance.wallet).to.exist
      expect(balance.available).to.exist
      expect(balance.total).to.be.greaterThan(0)
      expect(balance.meta).to.exist

    })

    expect(requestWeight.authed).to.be.greaterThan(0)

  })

  if (isGetTradableBalanceImplemented(exchangeAuthed)) {

    it('getTradableBalance', async () => {

      const {
        orderRate,
        symbolPair,
        orderAccount,
      } = exchangeConfigs

      const {
        tradableBalance,
        requestWeight,
      } = await exchangeAuthed.balance.getTradableBalance!({
        symbolPair,
        rate: orderRate,
        side: AlunaOrderSideEnum.BUY,
        account: orderAccount || AlunaAccountEnum.MARGIN,
      })

      expect(tradableBalance).to.be.greaterThan(0)
      expect(tradableBalance).to.exist

      expect(requestWeight.authed).to.be.greaterThan(0)

    })

  }

}
