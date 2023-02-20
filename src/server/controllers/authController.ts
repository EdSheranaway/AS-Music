/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { IAuthController } from '../serverTypes';
import { stringify } from 'querystring';
import { generateRandomString } from '../utils/serverUtils';
import axios, { AxiosResponse } from 'axios';
import { config } from 'dotenv';
config();
const { SPOTIFY_CID, SPOTIFY_CS, REDIRECT_URI } = process.env;

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
  spotifyAuthCallback: async (req, res, next) => {
    const code = (req.query.code as string) || null;
    try {
      const response = await axios({
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
            `${SPOTIFY_CID as string}:${SPOTIFY_CS as string}`
          ).toString('base64')}`,
        },
      });
      res.locals.data = `<pre>${JSON.stringify(response.data, null, 2)}</pre>`;
      return next();
    } catch (error) {
      return next({
        log: `Error caught in authController.spotifyAuth ${error}`,
        status: 401,
        message: 'Authentication failed',
      });
    }
  },
  refreshToken: async (req, res, next) => {
    const refresh_token = req.query.refresh_token as string;
    try {
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: stringify({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        }),
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${SPOTIFY_CID as string}:${SPOTIFY_CS as string}`
          ).toString('base64')}`,
        },
      });
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
