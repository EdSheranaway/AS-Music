/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { IAuthController } from '../serverTypes';
import { generateRandomString, verifyJwt } from '@utils';
import { signJwt } from '@utils';
import axios, { AxiosResponse, AxiosError } from 'axios';
import config from 'config';
import { stringify } from 'querystring';

const REDIRECT_URI = config.get<string>('redirectUri');
const SPOTIFY_CID = config.get<string>('spotifyCID');
const SPOTIFY_CS = config.get<string>('spotifyCS');

const authController: IAuthController = {
  signup: (req, res, next) => {},
  login: (req, res, next) => {},
  appleAuth: (req, res, next) => {},
  spotifyAuthInit: (req, res, next) => {
    try {
      const stateKey = 'spotify_auth_state';
      const state = generateRandomString(16);
      res.cookie(stateKey, state);

      const scope = 'user-read-private user-read-email';

      const queryParams = stringify({
        client_id: SPOTIFY_CID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        state,
        scope,
      });
      res.locals.redirect = `https://accounts.spotify.com/authorize?${queryParams}`;

      return next();
    } catch (error) {
      return next({
        log: `Error caught in authController.spotifyAuthInit ${error}`,
        status: 404,
        message: 'secret invalid',
      });
    }
  },
  spotifyAuthCallback: (req, res, next) => {
    const code = (req.query.code as string) || null;
    axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${SPOTIFY_CID}:${SPOTIFY_CS}`
        ).toString('base64')}`,
      },
    })
      .then((resp) => {
        if (resp.status === 200) {
          const access_token: string = resp.data.access_token;

          const expires_in: number = resp.data.expires_in;
          const refresh_token: string = resp.data.refresh_token;

          const spotifyAccessToken = signJwt(
            { access_token },
            'accessTokenPrivateKey',
            { expiresIn: expires_in }
          );

          const spotifyRefreshToken = signJwt(
            { refresh_token },
            'refreshTokenPrivateKey',
            { expiresIn: config.get('refreshTokenTtl') }
          );

          res.cookie('sAccessToken', spotifyAccessToken, {
            maxAge: expires_in, //15 mins,
            httpOnly: true,
            domain: config.get<string>('domain'),
            path: '/',
            sameSite: 'strict',
            secure: false, // in production put true because https
          });

          res.cookie('sRefreshToken', spotifyRefreshToken, {
            maxAge: 2.592e9, //30 days,
            httpOnly: true,
            domain: config.get<string>('domain'),
            path: '/',
            sameSite: 'strict',
            secure: false, // in production put true because https
          });

          res.locals.redirect = 'http://localhost:8080/';
          return next();
        } else {
          res.locals.redirect = `/?${stringify({
            error: 'invalid_token',
          })}`;
          return next();
        }
      })
      .catch((e) =>
        next({
          log: `Error caught in authController.spotifyAuth ${e}`,
          status: 401,
          message: 'Authentication failed',
        })
      );
  },
  refreshToken: async (req, res, next) => {
    const sRefreshToken: string = req.cookies.sRefreshToken;

    const { decoded, expired } = verifyJwt(
      sRefreshToken,
      'refreshTokenPublicKey'
    );

    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: stringify({
          grant_type: 'refresh_token',
          refresh_token: decoded?.refresh_token,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CID}:${SPOTIFY_CS}`
          ).toString('base64')}`,
        },
      });

      console.log(
        'file: authController.ts:137 => refreshToken: => data:',
        response
      );

      res.locals.refresh = response.data as AxiosResponse;
      return next();
    } catch (error) {
      return next({
        log: `Error caught in authController.refreshToken ${error}`,
        status: 400,
        message: 'Authentication Refresh Failed',
      });
    }
  },
  logout: (req, res, next) => {},
  verifyAuth: (req, res, next) => {},
};

export default authController;
