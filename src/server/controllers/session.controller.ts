/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { SessionModel } from '@models';
import config from 'config';
import { signJwt } from '@utils';
import { createSession } from '@services';
import { User, ISessionController } from '@serverTypes';

const sessionController: ISessionController = {
  createSession: async (req, res, next) => {
    const user = res.locals.user as User;

    try {
      const session = await createSession(
        user.userId,
        req.get('user-agent') || ''
      );
      const accessToken = signJwt(
        { ...user, session: session._id as string },
        'accessTokenPrivateKey',
        { expiresIn: config.get('accessTokenTtl') }
      );

      const refreshToken = signJwt(
        { ...user, session: session._id as string },
        'refreshTokenPrivateKey',
        { expiresIn: config.get('refreshTokenTtl') }
      );

      res.cookie('accessToken', accessToken, {
        maxAge: 900000, //15 mins,
        httpOnly: true,
        domain: config.get<string>('domain'),
        path: '/',
        sameSite: 'strict',
        secure: false, // in production put true because https
      });

      res.cookie('refreshToken', refreshToken, {
        maxAge: 2.592e9, // 30 days,
        httpOnly: true,
        domain: config.get<string>('domain'),
        path: '/',
        sameSite: 'strict',
        secure: false, // in production put true because https
      });

      res.locals.user = { ...user, accessToken, refreshToken };

      return next();
    } catch (error) {
      return next({
        message: 'error',
      });
    }
  },
  verifySession: async (_req, res, next) => {
    let user: string;
    if (res.locals.user.decoded) {
      user = res.locals.user.decoded._doc._id;
    } else {
      user = res.locals.user.userId;
    }
    try {
      const sessions = await SessionModel.find({ user, valid: true });

      if (sessions.length === 0) {
        return next({
          log: 'Error occured in sessionController.verifySession, session not found',
          status: 401,
          message: 'User not logged in',
        });
      }
      res.locals.sessions = sessions;
      return next();
    } catch (error) {
      return next({
        log: `Error occured in sessionController.verifySession: ${error}`,
        status: 401,
        message: { err: error },
      });
    }
  },
  voidSession: async (_req, res, next) => {
    try {
      const sessionId = res.locals.user.session;
      await SessionModel.findByIdAndUpdate(
        { _id: sessionId as string },
        { valid: false }
      );
      res.locals.user.session = { accessToken: null, refreshToken: null };
      return next();
    } catch (error) {
      return next({
        log: `Error occured in sessionController.voidSession: ${error}`,
        status: 404,
        message: { err: error },
      });
    }
  },
  deleteAllSessionsData: async (req, res, next) => {
    try {
      const deletedAll = await SessionModel.deleteMany();
      res.locals.deleted = deletedAll;
      return next();
    } catch (error) {
      return next({
        log: `Error occured in sessionController.deleteAllSessionsData: ${error}`,
        status: 404,
        message: { err: error },
      });
    }
  },
};
export default sessionController;
