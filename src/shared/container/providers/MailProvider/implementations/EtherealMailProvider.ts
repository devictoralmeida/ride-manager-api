import nodemailer, { Transporter } from 'nodemailer'
import { injectable } from 'tsyringe'
import { IMailProvider } from '../IMailProvider'
import handlebars from 'handlebars'
import fs from 'fs'

@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter

  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        })

        this.client = transporter
      })
      .catch((err) => console.error(err))
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string,
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)

    const templateHTML = templateParse(variables)

    const message = await this.client.sendMail({
      from: 'Rentx <noreply@rentx.com.br>',
      to,
      subject,
      html: templateHTML,
    })
  }
}
