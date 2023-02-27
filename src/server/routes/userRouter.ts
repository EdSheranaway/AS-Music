/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Router, Request, Response } from 'express';
import { userController, sessionController } from '@controllers';
import { CreateUserInput } from '@schemas';
import { requireUser, validateRe } from '@middleware';
import { createSessionSchema, createUserSchema } from '@schemas';

const userRouter = Router();

userRouter.get(
  '/me',
  requireUser,
  (
    _req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateUserInput['body']
    >,
    res: Response
  ) => {
    return res.send(res.locals.user);
  }
);

userRouter.post(
  '/signup',
  validateRe(createUserSchema),
  userController.signup,
  sessionController.createSession,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
  }
);

userRouter.post(
  '/login',
  validateRe(createSessionSchema),
  userController.login,
  sessionController.createSession,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.user);
  }
);

userRouter.get(
  '/session',
  requireUser,
  sessionController.verifySession,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.sessions);
  }
);

userRouter.delete(
  '/session',
  requireUser,
  sessionController.voidSession,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.user.sessions);
  }
);

export default userRouter;
