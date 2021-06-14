import { expect } from 'chai'

import { IAlunaExchange } from '../IAlunaExchange'
import { AAlunaModule } from './AAlunaModule'



describe('AAlunaModule', () => {



  it('should ensure classes will inherit property just fine', async () => {

    const exchange = {} as IAlunaExchange

    const SomeModule = class extends AAlunaModule {}


    const module = new SomeModule({
      exchange,
    })

    expect(module instanceof AAlunaModule).to.be.ok
    expect(module.exchange).to.be.ok

  })

})
