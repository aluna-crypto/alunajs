import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'



export function key(params: IAuthedParams) {

  const { exchangeAuthed } = params

  it('fetchDetails', async () => {

    const {
      key,
      requestWeight,
    } = await exchangeAuthed.key.fetchDetails()

    expect(key).to.exist
    // expect(key.accountId).to.exist // <— not always present

    expect(key.permissions).to.exist
    expect(key.permissions.read).to.exist
    expect(key.permissions.withdraw).to.exist
    expect(key.permissions.trade).to.exist

    expect(key.meta).to.exist

    expect(requestWeight.authed).to.be.greaterThan(0)
    expect(requestWeight.public).to.be.eq(0)

  })

}
