/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  object: object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    'base64'
  ).toString('ascii');

  const key = jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: 'RS256',
  });

  return key;
}
export function verifyJwt(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) {
  const publicKey = Buffer.from(config.get<string>(keyName), 'base64').toString(
    'ascii'
  );
  try {
    const decoded = jwt.verify(token, publicKey) as jwt.JwtPayload;

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: unknown) {
    const errorObj = error as { message?: string };
    return {
      valid: false,
      expired: errorObj.message === 'jwt expired',
      decoded: null,
    };
  }
}
