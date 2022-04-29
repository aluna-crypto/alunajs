import axios from 'axios'
import Sinon from 'sinon'
import { ImportMock } from 'ts-mock-imports'



export const mockAxiosRequest = () => {

  const request = Sinon.stub()

  const axiosCreate = ImportMock.mockFunction(
    axios,
    'create',
    { request },
  )

  return {
    request,
    axiosCreate,
  }

}
