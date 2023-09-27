import 'dotenv/config'
import 'reflect-metadata'
import { IUsersRepository } from '@modules/accounts/repositories/IUsersRepository'
import { injectable, inject } from 'tsyringe'
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository'
import AppError from '@shared/errors/AppError'
import path from 'path'
import { v4 as uuidV4 } from 'uuid'
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider'
import { IMailProvider } from '@shared/container/providers/MailProvider/IMailProvider'

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,

    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider,
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('User not found', 404)
    }

    const token = uuidV4()
    const expires_date = this.dateProvider.addHours(3)

    const templatePath: string = path.join(
      __dirname,
      '../../views/emails/forgotPassword.hbs',
    )

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    }

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    })

    await this.mailProvider.sendMail(
      email,
      'Recuperação de senha',
      variables,
      templatePath,
    )
  }
}
