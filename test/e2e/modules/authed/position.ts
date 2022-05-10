import { expect } from 'chai'

import { IAuthedParams } from '../IAuthedParams'



export function position(params: IAuthedParams) {

  const {
    exchangeAuthed,
    // exchangeConfigs,
  } = params

  it('list', async () => {

    const {
      positions,
      requestWeight,
    } = await exchangeAuthed.position!.list()

    expect(positions).to.exist

    expect(requestWeight.authed).to.be.greaterThan(1)
    expect(requestWeight.public).to.be.eq(0)

  })

  it('listRaw', async () => {

    const {
      rawPositions,
      requestWeight,
    } = await exchangeAuthed.position!.listRaw()

    expect(rawPositions).to.exist

    expect(requestWeight.authed).to.be.greaterThan(1)
    expect(requestWeight.public).to.be.eq(0)

  })

  it('get', async () => {
    expect(true).to.be.ok
  })

  it('close', async () => {
    expect(true).to.be.ok
  })

  it('setLeverage', async () => {
    expect(true).to.be.ok
  })

  it('getLeverage', async () => {
    expect(true).to.be.ok
  })

}
