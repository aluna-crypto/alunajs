import { expect } from 'chai'

import { exchanges } from './Exchanges'



describe('Exchanges', () => {

  it('should reference all implemented exchanges', async () => {

    expect(exchanges.Bittrex).to.be.ok

  })

})
