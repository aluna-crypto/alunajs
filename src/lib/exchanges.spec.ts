import { expect } from 'chai'

import { bittrexBaseSpecs } from '../exchanges/bittrex/bittrexSpecs'
import { exchanges } from './exchanges'



describe('Exchanges', () => {

  it('should reference all implemented exchanges', async () => {

    expect(exchanges[bittrexBaseSpecs.id]).to.be.ok

  })

})
