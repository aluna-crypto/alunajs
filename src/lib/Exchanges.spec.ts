import { expect } from 'chai'

import { Exchanges } from './Exchanges'



describe('Exchanges', () => {

  it('should reference all implemented exchanges', async () => {

    expect(Exchanges.Valr).to.be.ok

  })

})
