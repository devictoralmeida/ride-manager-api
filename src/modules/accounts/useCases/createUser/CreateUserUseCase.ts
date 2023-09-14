import "reflect-metadata";
import { injectable, inject } from "tsyringe";
import { User } from "../../infra/typeorm/entities/User";
import { hashSync } from "bcryptjs";
import AppError from "@shared/errors/AppError";
import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";

@injectable()
export class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,
  ) {}

  async execute({
    name,
    email,
    driver_license,
    password,
  }: ICreateUserDTO): Promise<User> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email);

    if (userAlreadyExists) {
      throw new AppError("User already exists", 409);
    }

    const newUser = await this.usersRepository.create({
      name,
      email,
      driver_license,
      password: hashSync(password, 8),
    });

    return newUser;
  }
}
