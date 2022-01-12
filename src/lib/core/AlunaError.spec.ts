import { expect } from 'chai'

import { AlunaError } from './AlunaError'



describe('AlunaError', () => {



  it('should create error just fine', () => {

    const httpStatusCode = 200
    const errorMsg = 'message'
    const errorCode = 'code'
    const metadata = { some: 'thing' }

    const error = new AlunaError({
      httpStatusCode,
      errorMsg,
      errorCode,
      metadata,
    })

    expect(error).to.be.ok

    expect(error.httpStatusCode).to.eq(httpStatusCode)
    expect(error.errorMsg).to.eq(errorMsg)
    expect(error.errorCode).to.eq(errorCode)
    expect(error.metadata).to.eq(metadata)

  })



  it('should create error with default httpStatusCode', () => {

    const defaultHttpStatusCode = 400

    const error = new AlunaError({
      // httpStatusCode, // no status code here
      errorMsg: 'message',
      errorCode: 'code',
    })

    expect(error).to.be.ok
    expect(error.httpStatusCode).to.eq(defaultHttpStatusCode)

  })



  it('should create error without metadata', () => {

    const error = new AlunaError({
      httpStatusCode: 200,
      errorMsg: 'message',
      errorCode: 'code',
    })

    expect(error).to.be.ok
    expect(error.metadata).to.not.exist

  })



})
