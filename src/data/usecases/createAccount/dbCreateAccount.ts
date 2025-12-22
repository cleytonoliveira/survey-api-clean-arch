import { AccountModel } from '../../../domain/models/account'
import { CreateAccount, CreateAccountModel } from '../../../domain/usecases/createAccount'
import { Encrypter } from '../../protocols/encrypter'

export class DbCreateAccount implements CreateAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async create (account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
