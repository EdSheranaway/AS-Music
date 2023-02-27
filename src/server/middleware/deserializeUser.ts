import { verifyJwt } from '@utils';
import { reIssueAccessToken } from '@services';
import { get } from 'lodash';
import { IMiddleware } from '@serverTypes';
import config from 'config';

const deserializeUser: IMiddleware = async (req, res, next) => {
  const accessToken: string =
    get(req, 'cookies.accessToken') ||
    get(req, 'headers.authorization', '').replace(/^Bearer\s/, '');

  console.log(
    'file: deserializeUser.ts:10 => constdeserializeUser:IMiddleware= => accessToken:',
    accessToken
  );

  const refreshToken: string =
    get(req, 'cookies.refreshToken') || get(req, 'headers.x-refresh');

  console.log(
    'file: deserializeUser.ts:19 => constdeserializeUser:IMiddleware= => refreshToken:',
    refreshToken
  );
  if (!accessToken && !refreshToken) {
    console.log('no access and no refresh');
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey');

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (
    (expired && refreshToken && typeof refreshToken === 'string') ||
    (!accessToken && refreshToken)
  ) {
    console.log('hi');
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    console.log(
      'file: deserializeUser.ts:42 => constdeserializeUser:IMiddleware= => newAccessToken:',
      newAccessToken
    );

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);

      res.cookie('accessToken', newAccessToken, {
        maxAge: 900000, //15 mins,
        httpOnly: true,
        domain: config.get<string>('domain'),
        path: '/',
        sameSite: 'strict',
        secure: false, // in production put true because https
      });
    }

    const result = verifyJwt(newAccessToken as string, 'accessTokenPublicKey');

    res.locals.user = result;
  }

  return next();
};

export default deserializeUser;
