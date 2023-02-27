import { Router } from 'express';
import { authController } from '@controllers';
import deserializeSpotifUser from '../middleware/deserializeSpotifyUser';
const oAuthRouter = Router();

// oAuth to spotify and apple
oAuthRouter.get('/spotify', authController.spotifyAuthInit, (_req, res) => {
  res.redirect(res.locals.redirect as string);
});

oAuthRouter.get(
  '/callback',
  authController.spotifyAuthCallback,
  (_req, res) => {
    res.redirect(res.locals.redirect as string);
  }
);

oAuthRouter.get('/spotify/me', deserializeSpotifUser, (_req, res) => {
  res.status(200).json(res.locals.spotifyUser);
});

oAuthRouter.post('/apple', (req, res) => {
  res.status(200).json(res.locals.userApple);
});

oAuthRouter.post('/logout', (req, res) => {
  res.clearCookie('access-token');
  res.sendStatus(204);
});

export default oAuthRouter;
