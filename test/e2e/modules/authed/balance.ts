import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'



export function balance(params: IAuthedParams) {

  const { exchangeAuthed } = params

  it('list', () => {
    expect(exchangeAuthed).to.be.ok
  })

  it('listRaw', () => {
    expect(exchangeAuthed).to.be.ok
  })

  it('getTradableBalance', () => {
    expect(exchangeAuthed).to.be.ok
  })

}
