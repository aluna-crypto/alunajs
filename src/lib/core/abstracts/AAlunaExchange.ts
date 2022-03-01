import { IAlunaKeySecretSchema } from '../../schemas/IAlunaKeySecretSchema'



export abstract class AAlunaExchange {

  public keySecret: IAlunaKeySecretSchema

  constructor (params: {
    keySecret: IAlunaKeySecretSchema,
  }) {

    this.keySecret = params.keySecret

  }

}
