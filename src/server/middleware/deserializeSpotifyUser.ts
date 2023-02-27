// const spotifyJWT = verifyJwt(spotifyAccessToken, 'accessTokenPublicKey');
import { signJwt, verifyJwt } from '@utils';
import axios from 'axios';
import { get } from 'lodash';
import { IMiddleware } from '@serverTypes';
import config from 'config';
import { stringify } from 'querystring';

const SPOTIFY_CID = config.get<string>('spotifyCID');
const SPOTIFY_CS = config.get<string>('spotifyCS');

interface IResponseData {
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };
}

const deserializeSpotifUser: IMiddleware = async (req, res, next) => {
  const sAccessToken: string = get(req, 'cookies.sAccessToken');
  const sRefreshToken: string = get(req, 'cookies.sRefreshToken');

  if (!sAccessToken && !sRefreshToken) {
    return next();
  }
  const { decoded, expired } = verifyJwt(sAccessToken, 'accessTokenPublicKey');

  if (decoded) {
    res.locals.spotifyUser = decoded;
    return next();
  }

  if (
    (expired && sRefreshToken && typeof sRefreshToken === 'string') ||
    (!sAccessToken && sRefreshToken)
  ) {
    const { decoded } = verifyJwt(sRefreshToken, 'refreshTokenPublicKey');

    if (!decoded) return next();

    const response: IResponseData = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: stringify({
        grant_type: 'refresh_token',
        refresh_token: decoded.refresh_token,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CID}:${SPOTIFY_CS}`
        ).toString('base64')}`,
      },
    });

    if (response satisfies IResponseData) {
      const newAccessToken = signJwt(
        { access_token: response.data.access_token },
        'accessTokenPrivateKey',
        { expiresIn: 3600 }
      );
      res.setHeader('x-access-token', newAccessToken);

      res.cookie('sAccessToken', newAccessToken, {
        maxAge: 900000, //15 mins,
        httpOnly: true,
        domain: config.get<string>('domain'),
        path: '/',
        sameSite: 'strict',
        secure: false, // in production put true because https
      });

      const result = verifyJwt(newAccessToken, 'accessTokenPublicKey');

      res.locals.user = result;
    }
  }
  return next();
};

export default deserializeSpotifUser;
