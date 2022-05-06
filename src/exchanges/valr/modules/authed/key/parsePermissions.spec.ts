import { expect } from 'chai'

import { IAlunaCredentialsSchema } from '../../../../../lib/schemas/IAlunaCredentialsSchema'
import { ValrAuthed } from '../../../ValrAuthed'
import { IValrKeySchema, ValrApiKeyPermissionsEnum } from '../../../schemas/IValrKeySchema'
import { VALR_KEY_PERMISSIONS } from '../../../test/fixtures/valrKey'



describe(__filename, () => {

  it(
    'should parse Valr key permissions just fine w/o any permission',
    async () => {

      // preparing data
      const rawKey: IValrKeySchema = VALR_KEY_PERMISSIONS

      const credentials: IAlunaCredentialsSchema = {
        key: 'key',
        secret: 'secret',
        passphrase: 'passphrase',
      }

      const exchange = new ValrAuthed({ credentials })


      // executing
      const { key } = exchange.key.parsePermissions({ rawKey })


      // validating
      expect(key.read).not.to.be.ok
      expect(key.withdraw).not.to.be.ok
      expect(key.trade).not.to.be.ok

    },
  )

  it(
    'should parse Valr key permissions just fine w/ permissions',
    async () => {

      // preparing data
      const rawKey: IValrKeySchema = VALR_KEY_PERMISSIONS

      rawKey.permissions = [
        ValrApiKeyPermissionsEnum.VIEW_ACCESS,
        ValrApiKeyPermissionsEnum.TRADE,
        ValrApiKeyPermissionsEnum.WITHDRAW,
        'NEW_ADDED_PERSSION' as ValrApiKeyPermissionsEnum,
      ]

      const credentials: IAlunaCredentialsSchema = {
        key: 'key',
        secret: 'secret',
        passphrase: 'passphrase',
      }

      const exchange = new ValrAuthed({ credentials })


      // executing
      const { key } = exchange.key.parsePermissions({ rawKey })


      // validating
      expect(key.read).to.be.ok
      expect(key.withdraw).to.be.ok
      expect(key.trade).to.be.ok

    },
  )

})
