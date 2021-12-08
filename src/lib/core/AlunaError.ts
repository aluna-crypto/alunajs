export class AlunaError {

  public data: {
    ok: false,
    error?: string,
    [key: string]: any,
  }

  public statusCode: number



  constructor (params: {
    data: any,
    statusCode?: number,
  }) {

    this.data = {
      ...params.data,
      ok: false,
    }

    this.statusCode = params.statusCode || 400

  }

}
