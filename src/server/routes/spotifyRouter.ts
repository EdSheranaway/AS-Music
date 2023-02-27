import { Router } from 'express';
import { SpotifyController } from '@controllers';
import { deserializeSpotifyUser } from '@middleware';
const spotifyRouter = Router();

spotifyRouter.get(
  '/user',
  deserializeSpotifyUser,
  SpotifyController.getUserInfo,
  (_req, res) => {
    res.status(200).json(res.locals.spotifyProfile);
  }
);

export default spotifyRouter;
