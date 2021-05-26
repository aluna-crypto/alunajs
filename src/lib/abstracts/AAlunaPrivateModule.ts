import { IAlunaPrivateRequest } from './IAlunaPrivateRequest'



export abstract class AAlunaPrivateModule {

  protected requestHandler: IAlunaPrivateRequest

  constructor (requestHandler: IAlunaPrivateRequest) {

    this.requestHandler = requestHandler

  }

}
