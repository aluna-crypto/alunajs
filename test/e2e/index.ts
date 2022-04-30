import { each } from 'lodash'

import { exchanges } from '../../src/lib/exchanges'
import { testExchange } from './testExchange'



describe('aluna:e2e', () => {

  each(Object.keys(exchanges), (exchangeId) => {
    describe(`——— ${exchangeId}`, () => {
      testExchange(exchangeId)
    })
  })

})
