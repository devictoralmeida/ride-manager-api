import { InMemoryUsersRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryUsersTokensRepository } from '@modules/accounts/repositories/in-memory/InMemoryUsersTokensRepository'
import { DayjsDateProvider } from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider'
import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase'
import { InMemoryMailProvider } from '@shared/container/providers/MailProvider/in-memory/InMemoryMailProvider'
import AppError from '@shared/errors/AppError'

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryUsersTokensRepository: InMemoryUsersTokensRepository
let dateProvider: DayjsDateProvider
let inMemoryMailProvider: InMemoryMailProvider

describe('Send Forgot Email', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryUsersTokensRepository = new InMemoryUsersTokensRepository()
    dateProvider = new DayjsDateProvider()
    inMemoryMailProvider = new InMemoryMailProvider()
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      inMemoryUsersRepository,
      inMemoryUsersTokensRepository,
      dateProvider,
      inMemoryMailProvider,
    )
  })

  it('Should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(inMemoryMailProvider, 'sendMail')

    await inMemoryUsersRepository.create({
      driver_license: '283070170',
      email: 'vafzu@tu.pe',
      name: 'Francisco Rowe',
      password: '1204100819',
    })

    await sendForgotPasswordMailUseCase.execute('vafzu@tu.pe')

    expect(sendMail).toHaveBeenCalled()
  })

  it('Should NOT be able to send a forgot password mail if user does not exists', async () => {
    const result = sendForgotPasswordMailUseCase.execute('123@tu.pe')

    await expect(result).rejects.toEqual(new AppError('User not found', 404))
  })

  it('Should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(
      inMemoryUsersTokensRepository,
      'create',
    )

    await inMemoryUsersRepository.create({
      driver_license: '283',
      email: 'va@tu.pe',
      name: 'Francisco Tabosa',
      password: '12041',
    })

    await sendForgotPasswordMailUseCase.execute('va@tu.pe')

    expect(generateTokenMail).toHaveBeenCalled()
  })
})
