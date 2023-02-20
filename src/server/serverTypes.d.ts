import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

export interface IAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  spotifyAuthInit: (req: Request, res: Response, next: NextFunction) => void;
  spotifyAuthCallback: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise;
  refreshToken: (req: Request, res: Response, next: NextFunction) => Promise;
  appleAuth: (req: Request, res: Response, next: NextFunction) => void;
  verifyAuth: (req: Request, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
}
