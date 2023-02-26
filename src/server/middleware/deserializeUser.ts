import { verifyJwt } from '@utils';
import { reIssueAccessToken } from '@services';
import { get } from 'lodash';
import { IMiddleware } from '@serverTypes';

const deserializeUser: IMiddleware = async (req, res, next) => {
  const accessToken = get(req, 'headers.authorization', '').replace(
    /^Bearer\s/,
    ''
  );

  const refreshToken = get(req, 'headers.x-refresh');

  if (!accessToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey');

  if (decoded) {
    res.locals.user = decoded;
    return next();
  }

  if (expired && refreshToken && typeof refreshToken === 'string') {
    const newAccessToken = await reIssueAccessToken({ refreshToken });

    if (newAccessToken) {
      res.setHeader('x-access-token', newAccessToken);
    }

    const result = verifyJwt(newAccessToken as string, 'accessTokenPublicKey');

    res.locals.user = result;
  }

  return next();
};

export default deserializeUser;
