import { MissingParamError, InvalidParamError } from '../errors'
import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../protocols'
import { badRequest, serverError } from '../helpers/httpHelper'
import { CreateAccount } from '../../domain/usecases/createAccount'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly createAccount: CreateAccount

  constructor (emailValidator: EmailValidator, createAccount: CreateAccount) {
    this.emailValidator = emailValidator
    this.createAccount = createAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field))
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      this.createAccount.create({
        name,
        email,
        password
      })
    } catch (error) {
      return serverError()
    }
  }
}
