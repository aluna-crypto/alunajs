import { AlunaError } from '../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../lib/errors/AlunaAccountsErrorCodes'
import { IAlunaKeySecretSchema } from '../../../lib/schemas/IAlunaKeySecretSchema'
import { HuobiHttp } from '../HuobiHttp'
import { PROD_HUOBI_URL } from '../HuobiSpecs'
import {
  HuobiAccountTypeEnum,
  IHuobiUserAccountSchema,
} from '../schemas/IHuobiBalanceSchema'



export interface IHuobiGetAccountIdReturns {
  accountId: number
  requestCount: number
}

export const getHuobiAccountId = async (
  keySecret: IAlunaKeySecretSchema,
): Promise<IHuobiGetAccountIdReturns> => {

  const {
    data: accounts,
    requestCount,
  } = await HuobiHttp
    .privateRequest<IHuobiUserAccountSchema[]>({
      verb: AlunaHttpVerbEnum.GET,
      url: `${PROD_HUOBI_URL}/v1/account/accounts`,
      keySecret,
    })

  const spotAccount = accounts.find(
    (account) => account.type === HuobiAccountTypeEnum.SPOT,
  )

  if (!spotAccount) {

    throw new AlunaError({
      message: 'spot account not found',
      code: AlunaAccountsErrorCodes.TYPE_NOT_FOUND,
      httpStatusCode: 404,
    })

  }

  const { id: accountId } = spotAccount

  return {
    accountId,
    requestCount,
  }

}
