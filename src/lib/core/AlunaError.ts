export class AlunaError {

  public code: string
  public message: string

  public metadata?: any
  public httpStatusCode?: number

  constructor (params: {
    code: string,
    message: string,
    metadata?: any,
    httpStatusCode?: number,
  }) {

    this.code = params.code
    this.message = params.message

    if (params.metadata) {

      this.metadata = params.metadata

    }

    this.httpStatusCode = params.httpStatusCode || 400

  }

}
