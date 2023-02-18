import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  (req: Request, res: Response, next: NextFunction): void;
}

export interface IAuthController {
  signup: (req: Request, res: Response, next: NextFunction) => void;
  login: (req: Request, res: Response, next: NextFunction) => void;
  spotifyAuth: (req: Request, res: Response, next: NextFunction) => void;
  appleAuth: (req: Request, res: Response, next: NextFunction) => void;
  verifyAuth: (req: Request, res: Response, next: NextFunction) => void;
  logout: (req: Request, res: Response, next: NextFunction) => void;
}
