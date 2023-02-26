import { Router, Request, Response } from 'express';
import sessionController from '../controllers/session.controller';
import userController from '../controllers/user.controller';
import requireUser from '../middleware/requireUser';
import validateRe from '../middleware/validateResource';
import { createSessionSchema } from '../schema/session.schema';
import { createUserSchema } from '../schema/user.schema';

const userRouter = Router();

userRouter.post(
  '/signup',
  validateRe(createUserSchema),
  userController.signup,
  (_req: Request, res: Response) => {
    return res.status(200).json(res.locals.newUser);
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
