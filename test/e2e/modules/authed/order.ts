import { AlunaAccountEnum } from '../../../../src/lib/enums/AlunaAccountEnum'
import { AlunaOrderTypesEnum } from '../../../../src/lib/enums/AlunaOrderTypesEnum'
import { IAuthedParams } from '../IAuthedParams'
import { isOrderTypeSupportedAndImplemented } from './helpers/utils/isOrderTypeSupportedAndImplemented'
import { testLimitOrder } from './tests/testLimitOrder'
import { testMarketOrder } from './tests/testMarketOrder'
import { testStopLimitOrder } from './tests/testStopLimitOrder'
import { testStopMarketOrder } from './tests/testStopMarketOrder'



export function order(params: IAuthedParams) {

  const {
    exchangeAuthed,
    exchangeConfigs,
  } = params

  const { orderAccount } = exchangeConfigs


  /**
   * Limit Orders
   */
  testLimitOrder(params)



  /**
   * Market Orders
   */
  const isMarketOrderSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.SPOT,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.MARKET,
  })

  if (isMarketOrderSupported) {
    testMarketOrder(params)
  }



  /**
   * Stop Limit Orders
   */
  const isStopLimitOrderSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.SPOT,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.STOP_LIMIT,
  })

  if (isStopLimitOrderSupported) {

    testStopLimitOrder(params)

  }



  /**
   * Stop Market Orders
   */
  const isStopMarketOrderSupported = isOrderTypeSupportedAndImplemented({
    account: orderAccount || AlunaAccountEnum.SPOT,
    exchangeAuthed,
    orderType: AlunaOrderTypesEnum.STOP_MARKET,
  })

  if (isStopMarketOrderSupported) {

    testStopMarketOrder(params)

  }

}
