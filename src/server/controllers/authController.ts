import { IAuthController } from '../serverTypes';

const authController: IAuthController = {
  signup: (req, res, next) => {},
  login: (req, res, next) => {},
  appleAuth: (req, res, next) => {},
  spotifyAuth: (req, res, next) => {},
  logout: (req, res, next) => {},
  verifyAuth: (req, res, next) => {},
};

export default authController;
