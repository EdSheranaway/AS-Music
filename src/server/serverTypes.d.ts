import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import { CreateUserInput, CreateSessionInput } from '@schemas';
import mongoose from 'mongoose';

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
  appleAuth: (req: Request, res: Response, next: NextFunction) => void;
}

export interface IUserController {
  signup: (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateUserInput['body']
    >,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  login: (
    req: Request<
      Record<string, never>,
      Record<string, never>,
      CreateSessionInput['body']
    >,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export interface ISessionController {
  createSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  verifySession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  voidSession: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  deleteAllSessionsData: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export interface ISpotifyController {
  getUserInfo: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
}

export type User = {
  userId: string;
  name: string;
  email: string;
};

export type RequestBody = CreateSessionInput | CreateUserInput;

export type ErrorHandler = {
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void;
};

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Data {
  data: {
    country: string;
    display_name: string;
    email: string;
    explicit_content: Explicitcontent;
    external_urls: Externalurls;
    followers: Followers;
    href: string;
    id: string;
    images: string[][];
    product: string;
    type: string;
    uri: string;
  };
}

interface Followers {
  href: string | null;
  total: number;
}

interface Externalurls {
  spotify: string;
}

interface Explicitcontent {
  filter_enabled: boolean;
  filter_locked: boolean;
}
