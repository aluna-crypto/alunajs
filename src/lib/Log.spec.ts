import { expect } from 'chai'

import { Log } from './Log'



describe('Log', () => {

  it('should export configured logger with all expected methods', async () => {

    expect(Log).to.be.ok
    expect(Log.silly).to.be.ok
    expect(Log.debug).to.be.ok
    expect(Log.trace).to.be.ok
    expect(Log.info).to.be.ok
    expect(Log.warn).to.be.ok
    expect(Log.error).to.be.ok
    expect(Log.fatal).to.be.ok

  })

})
