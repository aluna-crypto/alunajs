export abstract class AAlunaError {

  public message: string;
  public statusCode: number;



  constructor (params: {
    message: string,
    statusCode?: number,
  }) {
    this.message = params.message
    this.statusCode = params.statusCode || 400
  }

}
