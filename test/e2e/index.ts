import { each } from 'lodash'
import { exchanges } from '../../src/lib/exchanges'

import { testExchange } from './testExchange'



describe('aluna', () => {

  const exchangeIds = Object.keys(exchanges)

  each(exchangeIds, (exchangeId) => {
    describe(`— ${exchangeId}`, () => {
      testExchange(exchangeId)
    })
  })

})
