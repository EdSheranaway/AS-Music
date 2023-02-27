import axios from 'axios';
import { Data, ISpotifyController } from '@serverTypes';
import config from 'config';

const spotify = config.get<string>('spotifyBaseUrl');

const SpotifyController: ISpotifyController = {
  getUserInfo: async (_req, res, next) => {
    try {
      const { access_token } = res.locals.spotifyUser;

      const user: Data = await axios.get(`${spotify}/me`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      res.locals.spotifyProfile = user.data;
      return next();
    } catch (error) {
      if (error instanceof Error) {
        return next({
          log: `Error caught in spotifyController.getUserInfo ${error}`,
          status: 401,
          message: `Authentication failed: ${error.message}`,
        });
      }
    }
  },
};

export default SpotifyController;
