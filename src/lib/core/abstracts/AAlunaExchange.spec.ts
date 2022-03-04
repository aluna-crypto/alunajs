import { expect } from 'chai'

import { AAlunaExchange } from './AAlunaExchange'



describe('AAlunaExchange', () => {

  it('should ensure classes will inherit properties just fine', async () => {

    const keySecret = {
      secret: '',
      key: '',
    }

    const SomeExchange = class extends AAlunaExchange {}

    const exchange1 = new SomeExchange({
      keySecret,
    })

    expect(exchange1 instanceof AAlunaExchange).to.be.ok
    expect(exchange1.keySecret.key).to.be.eq(keySecret.key)
    expect(exchange1.keySecret.secret).to.be.eq(keySecret.secret)

    const exchange2 = new SomeExchange({
      keySecret,
    })

    expect(exchange2 instanceof AAlunaExchange).to.be.ok
    expect(exchange2.keySecret).to.be.ok

    const exchange3 = new SomeExchange({
      keySecret,
    })

    expect(exchange3 instanceof AAlunaExchange).to.be.ok
    expect(exchange3.keySecret).to.be.ok

  })

})
