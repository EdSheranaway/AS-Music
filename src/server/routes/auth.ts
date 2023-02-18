import { Router } from 'express';

const router = Router();

// oAuth to spotify and apple
router.post('/spotify', (req, res) => {
  res.status(200).json(res.locals.userSpotify);
});

router.post('/apple', (req, res) => {
  res.status(200).json(res.locals.userApple);
});

// regular login and signup
router.post('/signup', (req, res) => {
  res.status(200).json(res.locals.user);
});

router.post('/login', (req, res) => {
  res.status(200).json(res.locals.user);
});

router.get('/', (req, res) => {
  res.status(200).json(res.locals.verifiedUser);
});

router.post('/logout', (req, res) => {
  res.clearCookie('access-token');
  res.sendStatus(204);
});

export default router;
