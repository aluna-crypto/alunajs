import { expect } from 'chai'

import { AAlunaExchange } from './AAlunaExchange'



describe('AAlunaExchange', () => {



  it('should ensure classes will inherit properties just fine', async () => {

    const keySecret = {
      secret: '',
      key: '',
    }

    const settings = {
      referralCode: 'dummy ref',
    }

    const SomeExchange = class extends AAlunaExchange {}


    const exchange1 = new SomeExchange({
      keySecret,
      settings,
    })

    expect(exchange1 instanceof AAlunaExchange).to.be.ok
    expect(exchange1.keySecret.key).to.be.eq(keySecret.key)
    expect(exchange1.keySecret.secret).to.be.eq(keySecret.secret)
    expect(exchange1.settings).to.be.ok
    expect(exchange1.settings?.referralCode).to.be.ok


    const exchange2 = new SomeExchange({
      keySecret,
      settings: {},
    })

    expect(exchange2 instanceof AAlunaExchange).to.be.ok
    expect(exchange2.keySecret).to.be.ok
    expect(exchange2.settings).to.be.ok
    expect(exchange2.settings?.referralCode).to.be.undefined


    const exchange3 = new SomeExchange({
      keySecret,
    })

    expect(exchange3 instanceof AAlunaExchange).to.be.ok
    expect(exchange3.keySecret).to.be.ok
    expect(exchange3.settings).to.be.undefined

  })

})
