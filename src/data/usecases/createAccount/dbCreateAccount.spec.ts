import { Encrypter } from './dbCreateAccountProtocols'
import { DbCreateAccount } from './dbCreateAccount'

interface SutTypes {
  sut: DbCreateAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
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

  test('should throw if Encrypter throws an error', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const accountData = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password'
    }
    const promise = sut.create(accountData)
    await expect(promise).rejects.toThrow()
  })
})
