/* eslint-disable @typescript-eslint/no-inferrable-types */
export default class AppError extends Error {
  public statusCode: number

  constructor(message: string, statusCode: number = 400) {
    super(message)
    this.statusCode = statusCode
    console.log(statusCode)
  }
}
