export class AlunaError {

  public ok: false
  public errorMsg: string
  public errorCode: string
  public metadata?: any

  public httpStatusCode: number



  constructor (params: {
    httpStatusCode?: number,
    errorCode: string,
    errorMsg: string,
    metadata?: any,
  }) {

    this.ok = false
    this.errorMsg = params.errorMsg
    this.errorCode = params.errorCode
    this.metadata = params.metadata

    this.httpStatusCode = params.httpStatusCode || 400

  }

}
