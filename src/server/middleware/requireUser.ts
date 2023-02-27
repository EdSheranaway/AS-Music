import { IMiddleware } from '@serverTypes';

const requireUser: IMiddleware = (_req, res, next) => {
  const user = res.locals.user;

  if (!user) {
    return next({
      log: 'Error occured in requireUser middleware, user is not logged in',
      status: 403,
      message: { err: 'User not logged in' },
    });
  }

  return next();
};

export default requireUser;
