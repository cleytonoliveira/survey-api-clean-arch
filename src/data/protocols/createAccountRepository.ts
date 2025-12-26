import { AccountModel } from '../../domain/models/account'
import { CreateAccountModel } from '../../domain/usecases/createAccount'

export interface CreateAccountRepository {
  create (accountData: CreateAccountModel): Promise<AccountModel>
}
