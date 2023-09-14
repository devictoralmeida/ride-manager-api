/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import AppError from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";
import { Response, Request, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const ensureAuthenticated = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const authorization: string | undefined = request.headers.authorization;

  if (!authorization) {
    throw new AppError("Token missing", 401);
  }

  const token: string = authorization.split(" ")[1];

  verify(token, process.env.SECRET_KEY!, (error: any, decoded: any) => {
    if (error) {
      throw new AppError("Invalid token!", 401);
    }

    response.locals = { ...response.locals, decoded };
  });

  const usersRepository = new UsersRepository();

  const { sub } = response.locals.decoded;
  const user_id: string = sub;

  const user = await usersRepository.findById(sub);

  if (!user) {
    throw new AppError("User does not exists!", 401);
  } else {
    request.user = {
      id: user_id,
    };
    return next();
  }
};
