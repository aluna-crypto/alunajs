import { each } from 'lodash'

import { exchanges } from '../../src/lib/exchanges'
import { testExchange } from './modules/testExchange'



describe('aluna', () => {

  const exchangeIds = Object.keys(exchanges)
  // const exchangeIds = ['myNewExchange']

  each(exchangeIds, (exchangeId) => {
    describe(`— ${exchangeId}`, () => {
      testExchange(exchangeId)
    })
  })

})
