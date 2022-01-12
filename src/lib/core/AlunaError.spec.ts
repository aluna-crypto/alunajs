import { expect } from 'chai'

import { AlunaError } from './AlunaError'



describe('AlunaError', () => {



  it('should create error just fine', () => {

    const message = 'message'
    const code = 'code'

    const metadata = { some: 'thing' }
    const httpStatusCode = 200

    const error = new AlunaError({
      code,
      message,
      metadata,
      httpStatusCode,
    })

    expect(error).to.be.ok

    expect(error.code).to.eq(code)
    expect(error.message).to.eq(message)

    expect(error.metadata).to.eq(metadata)
    expect(error.httpStatusCode).to.eq(httpStatusCode)

  })



  it('should create error with default httpStatusCode', () => {

    const defaultHttpStatusCode = 400

    const error = new AlunaError({
      code: 'code',
      message: 'message',
      // httpStatusCode, // no status code here
    })

    expect(error).to.be.ok
    expect(error.httpStatusCode).to.eq(defaultHttpStatusCode)

  })



  it('should create error without metadata', () => {

    const error = new AlunaError({
      code: 'code',
      message: 'message',
      httpStatusCode: 200,
    })

    expect(error).to.be.ok
    expect(error.metadata).to.not.exist

  })



})
