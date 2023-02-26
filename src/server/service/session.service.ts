import { verifyJwt, signJwt } from '@utils';
import { get } from 'lodash';
import SessionModel, { SessionDocument } from '../models/session.model';
import config from 'config';
import UserModel from '../models/user.model';

export async function createSession(userId: string, userAgent: string) {
  const session = await SessionModel.create({ user: userId, userAgent });

  return session;
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJwt(refreshToken, 'refreshTokenPublicKey');

  if (!decoded || !get(decoded, 'session')) return false;

  const session: SessionDocument | null = await SessionModel.findById(
    get(decoded, 'session')
  );

  if (!session || !session.valid) return false;

  const user = await UserModel.findById(session.user);

  if (!user) return false;
  const accessToken = signJwt(
    { ...user, session: session._id as string },
    'accessTokenPrivateKey',
    { expiresIn: config.get('accessTokenTtl') }
  );

  return accessToken;
}
