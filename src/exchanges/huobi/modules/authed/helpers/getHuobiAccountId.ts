import { find } from 'lodash'

import { AlunaError } from '../../../../../lib/core/AlunaError'
import { AlunaHttpVerbEnum } from '../../../../../lib/enums/AlunaHtttpVerbEnum'
import { AlunaAccountsErrorCodes } from '../../../../../lib/errors/AlunaAccountsErrorCodes'
import { HuobiAccountTypeEnum } from '../../../enums/HuobiAccountTypeEnum'
import { getHuobiEndpoints } from '../../../huobiSpecs'
import {
  IHuobiGetAccountIdHelperParams,
  IHuobiGetAccountIdHelperReturns,
  IHuobiUserAccountSchema,
} from '../../../schemas/IHuobiHelperSchema'



export const getHuobiAccountId = async (
  params: IHuobiGetAccountIdHelperParams,
): Promise<IHuobiGetAccountIdHelperReturns> => {

  const {
    http,
    credentials,
    settings,
  } = params

  const accounts = await http.authedRequest<IHuobiUserAccountSchema[]>({
    verb: AlunaHttpVerbEnum.GET,
    credentials,
    url: getHuobiEndpoints(settings).helpers.listAccounts,
  })

  const spotAccount = find(
    accounts,
    {
      type: HuobiAccountTypeEnum.SPOT,
    },
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
  }
}
