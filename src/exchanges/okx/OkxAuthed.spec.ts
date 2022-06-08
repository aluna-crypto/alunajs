import { expect } from 'chai'

import { AlunaKeyErrorCodes } from '../../lib/errors/AlunaKeyErrorCodes'
import { IAlunaCredentialsSchema } from '../../lib/schemas/IAlunaCredentialsSchema'
import { IAlunaSettingsSchema } from '../../lib/schemas/IAlunaSettingsSchema'
import { executeAndCatch } from '../../utils/executeAndCatch'
import { OkxAuthed } from './OkxAuthed'



describe(__filename, () => {

  it('should contain public & authed modules', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
      passphrase: 'some-passphrase',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const okx = new OkxAuthed({ settings, credentials })

    expect(okx.id).to.eq('okx')

    expect(okx.symbol).to.be.ok
    expect(okx.market).to.be.ok

    expect(okx.key).to.be.ok
    expect(okx.balance).to.be.ok
    expect(okx.order).to.be.ok
    expect(okx.position).to.be.ok

    expect(okx.specs).to.be.ok
    expect(okx.settings).to.deep.eq(okx.settings)

  })

  it('should ensure passphrase is present when instantiating authed Okx', async () => {

    const credentials: IAlunaCredentialsSchema = {
      key: 'some-key',
      secret: 'some-secret',
    }

    const settings: IAlunaSettingsSchema = {
      referralCode: '123',
    }

    const {
      error,
      result,
    } = await executeAndCatch(() => new OkxAuthed({ settings, credentials }))

    expect(result).not.to.be.ok

    expect(error!.code).to.be.eq(AlunaKeyErrorCodes.MISSING_PASSPHRASE)
    expect(error!.message).to.be.eq("'passphrase' is required for private requests on Okx")
    expect(error!.httpStatusCode).to.be.eq(200)

  })

})
