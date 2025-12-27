import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcryptAdapter'

const makeSut = (): BcryptAdapter => {
  const salt = 12
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  test('should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', 12)
  })
})
