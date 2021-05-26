import { IAlunaPublicRequest } from './IAlunaPublicRequest'



export abstract class AAlunaPublicModule {

  protected requestHandler: IAlunaPublicRequest

  constructor (requestHandler: IAlunaPublicRequest) {

    this.requestHandler = requestHandler

  }

}
