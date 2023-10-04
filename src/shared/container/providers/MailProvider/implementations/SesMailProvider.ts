import nodemailer, { Transporter } from 'nodemailer'
import aws from 'aws-sdk'
import { injectable } from 'tsyringe'
import fs from 'fs'
import handlebars from 'handlebars'
import { IMailProvider } from '../IMailProvider'

@injectable()
export class SesMailProvider implements IMailProvider {
  private client: Transporter

  constructor() {
    const ses = new aws.SES({
      apiVersion: '2010-12-01',
      region: process.env.AWS_REGION,
    })

    this.client = nodemailer.createTransport({
      SES: { ses, aws },
    })
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

    await this.client.sendMail({
      from: 'victoralmeida@devictoralmeida.com.br',
      to,
      subject,
      html: templateHTML,
    })
  }
}
