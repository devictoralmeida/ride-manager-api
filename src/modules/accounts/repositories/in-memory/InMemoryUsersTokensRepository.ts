import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO'
import { UserTokens } from '@modules/accounts/infra/typeorm/entities/UserTokens'
import { IUsersTokensRepository } from '../IUsersTokensRepository'

export class InMemoryUsersTokensRepository implements IUsersTokensRepository {
  usersTokens: UserTokens[] = []

  async create({
    expires_date,
    user_id,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens()

    Object.assign(userToken, {
      expires_date,
      user_id,
      refresh_token,
    })

    this.usersTokens.push(userToken)
    return userToken
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserTokens> {
    const userToken = this.usersTokens.find(
      (token) =>
        token.user_id === user_id && token.refresh_token === refresh_token,
    )
    return userToken
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokens.find((token) => token.id === id)
    this.usersTokens.splice(this.usersTokens.indexOf(userToken), 1)
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return this.usersTokens.find(
      (token) => token.refresh_token === refresh_token,
    )
  }
}
