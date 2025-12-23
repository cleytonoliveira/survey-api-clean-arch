import { Encrypter } from '../../protocols/encrypter'
import { DbCreateAccount } from './dbCreateAccount'

interface SutTypes {
  sut: DbCreateAccount
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  const encrypterStub = new EncrypterStub()
  const sut = new DbCreateAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DbCreateAccount Usecase', () => {
  test('should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encriptySpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    await sut.create(accountData)
    expect(encriptySpy).toHaveBeenCalledWith('valid_password')
  })
})
