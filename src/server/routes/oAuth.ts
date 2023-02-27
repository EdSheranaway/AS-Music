import { Router } from 'express';
import { authController } from '@controllers';
import deserializeSpotifUser from '../middleware/deserializeSpotifyUser';
const router = Router();

// oAuth to spotify and apple
router.get('/spotify', authController.spotifyAuthInit, (req, res) => {
  res.redirect(res.locals.redirect as string);
});

router.get('/callback', authController.spotifyAuthCallback, (req, res) => {
  res.redirect(res.locals.redirect as string);
});

router.get('/spotify/me', deserializeSpotifUser, (_req, res) => {
  res.status(200).json(res.locals.spotifyUser);
});

router.post('/apple', (req, res) => {
  res.status(200).json(res.locals.userApple);
});

router.post('/logout', (req, res) => {
  res.clearCookie('access-token');
  res.sendStatus(204);
});

export default router;
