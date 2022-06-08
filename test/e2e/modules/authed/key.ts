import { expect } from 'chai'

import { aluna } from '../../../../src/aluna'
import { AlunaKeyErrorCodes } from '../../../../src/lib/errors/AlunaKeyErrorCodes'
import { executeAndCatch } from '../../../../src/utils/executeAndCatch'
import { IAuthedParams } from '../IAuthedParams'



export function key(params: IAuthedParams) {

  const { exchangeAuthed } = params

  const {
    id,
    credentials,
  } = exchangeAuthed

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

  it('fetchDetails:invalid:api:key', async () => {

    const newCredentials = { ...credentials }
    newCredentials.key = newCredentials.key.slice(0, -1)

    const exchange = aluna(id, { credentials: newCredentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.INVALID)

    expect(error!.metadata).to.exist

  })

  it('fetchDetails:invalid:api:secret', async () => {

    const newCredentials = { ...credentials }
    newCredentials.secret = newCredentials.secret.slice(0, -1)

    const exchange = aluna(id, { credentials: newCredentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.INVALID)

    expect(error!.metadata).to.exist

  })

  it('fetchDetails:empty:api:key', async () => {

    const newCredentials = { ...credentials }
    newCredentials.key = ''

    const exchange = aluna(id, { credentials: newCredentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.INVALID)

    expect(error!.metadata).to.exist

  })

  it('fetchDetails:empty:api:secret', async () => {

    const newCredentials = { ...credentials }
    newCredentials.secret = ''

    const exchange = aluna(id, { credentials: newCredentials })

    const {
      error,
      result,
    } = await executeAndCatch(() => exchange.key.fetchDetails())

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.INVALID)

    expect(error!.metadata).to.exist

  })

}
